from machine import Pin, I2C, WDT
import math
import time
import utime
import network
import urequests
import ujson
import gc
import ubinascii
import machine
import random

# -------------------- CONFIG --------------------
WIFI_SSID = "ASK4 Wireless"
WIFI_PASSWORD = ""

# Firebase URL - Updated to use the test endpoint
FIREBASE_BASE_URL = "https://assistant-living-app-default-rtdb.europe-west1.firebasedatabase.app"
mpu_url = f"{FIREBASE_BASE_URL}/mpuEventsTest.json"

# MPU6050 constants
MPU_ADDR = 0x68
PWR_MGMT_1 = 0x6B
ACCEL_XOUT_H = 0x3B
GYRO_XOUT_H = 0x43

# Thresholds & Settings
MOVEMENT_THRESHOLD = 0.3  # Accelerometer threshold for movement detection
SIGNIFICANT_MOVEMENT_THRESHOLD = 0.9  # Threshold for significant movement
UNUSUAL_MOVEMENT_THRESHOLD = 5.0  # Threshold for unusual movement (potential fall)
READING_INTERVAL = 2  # seconds between readings
REPORT_INTERVAL = 10  # Report significant movements every X seconds

# Output control
VERBOSE_OUTPUT = False  # Set to False to reduce console output

# Get Device ID from Raspberry Pi Pico W hardware
def get_pico_w_id():
    unique_id = machine.unique_id()
    return ubinascii.hexlify(unique_id).decode()

# Device Identification
DEVICE_ID = get_pico_w_id()
TEST_ID = "PLANB_TEST_" + DEVICE_ID
TEST_VERSION = "1.0"
TEST_START_TIME = None

# Initialize variables
mpu_counter = 0
movement_detected = False
last_significant_report = 0
success_count = 0
failure_count = 0
total_latency = 0  # Track total latency for average calculation
consecutive_errors = 0  # Track consecutive errors for reset decision

# Performance metrics
latency_values = []  # Store latency values
max_latency = 0
min_latency = float('inf')

# Queue for unsent events
unsent_events = []
MAX_UNSENT_EVENTS = 20

# Connect to WiFi and get signal strength
def connect_to_wifi(ssid, password=""):
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    
    if not wlan.isconnected():
        print("Connecting to Wi-Fi...")
        retry_count = 0
        max_retries = 5
        
        while retry_count < max_retries and not wlan.isconnected():
            try:
                wlan.connect(ssid, password)
                
                # Wait for connection with timeout
                max_wait = 10
                while max_wait > 0 and not wlan.isconnected():
                    max_wait -= 1
                    if retry_count > 0:  # Only print after first attempt
                        print("Waiting for connection...")
                    time.sleep(1)
                
                if wlan.isconnected():
                    print("Connected to Wi-Fi:", wlan.ifconfig())
                    return True
                else:
                    retry_count += 1
                    print(f"Connection attempt {retry_count} failed. Retrying...")
                    time.sleep(5)
            except Exception as e:
                print(f"WiFi connection error: {e}")
                retry_count += 1
                time.sleep(5)
        
        if not wlan.isconnected():
            print("Failed to connect to Wi-Fi after multiple attempts")
            return False
    else:
        print("Already connected to Wi-Fi:", wlan.ifconfig())
        return True

# Get WiFi signal strength (RSSI)
def get_wifi_signal_strength():
    wlan = network.WLAN(network.STA_IF)
    if wlan.isconnected():
        try:
            return wlan.status('rssi')  # Return RSSI in dBm
        except:
            return None 
    return None

# Timestamp function
def get_formatted_timestamp():
    t = utime.localtime()
    return "{:04d}-{:02d}-{:02d}T{:02d}:{:02d}:{:02d}Z".format(t[0], t[1], t[2], t[3], t[4], t[5])

# Get the event date in YYYY-MM-DD format
def get_event_date():
    t = utime.localtime()
    return "{:04d}-{:02d}-{:02d}".format(t[0], t[1], t[2])

# Generate a unique event ID
def generate_event_id():
    random_bytes = bytearray(4)
    for i in range(len(random_bytes)):
        random_bytes[i] = random.randint(0, 255)
    timestamp = utime.time()
    return f"mpu_{timestamp}_{ubinascii.hexlify(random_bytes).decode()}"

# Send data to Firebase with latency tracking and error handling
def send_to_firebase(url, data):
    global success_count, failure_count, total_latency, max_latency, min_latency, unsent_events
    
    # Don't attempt to send if not connected to WiFi
    if not network.WLAN(network.STA_IF).isconnected():
        if len(unsent_events) < MAX_UNSENT_EVENTS:
            unsent_events.append(data)
        return False, 0
    
    # Start timing for latency measurement
    start_time = time.time()
    
    try:
        response = urequests.post(url, json=data)
        
        # Calculate latency
        end_time = time.time()
        latency = (end_time - start_time) * 1000  # Convert to milliseconds
        
        # Update latency statistics
        total_latency += latency
        latency_values.append(latency)
        if latency > max_latency:
            max_latency = latency
        if latency < min_latency:
            min_latency = latency
            
        if VERBOSE_OUTPUT:
            print(f"Data sent successfully to Firebase. Latency: {latency:.2f}ms")
        response.close()
        success_count += 1
        gc.collect()  # Help manage memory
        return True, latency
    except Exception as e:
        print(f"Error sending data to Firebase: {e}")
        failure_count += 1
        # Queue for retry
        if len(unsent_events) < MAX_UNSENT_EVENTS:
            unsent_events.append(data)
        return False, 0

# Retry sending any unsent events
def retry_unsent_events():
    global unsent_events
    
    if not unsent_events:
        return
        
    if not network.WLAN(network.STA_IF).isconnected():
        return  # Don't attempt retries if not connected
        
    print(f"Attempting to resend {len(unsent_events)} unsent events...")
    
    # Make a copy to avoid modifying during iteration
    events_to_retry = unsent_events.copy()
    unsent_events = []
    
    for data in events_to_retry:
        # Update timestamps
        data["timestamp"] = get_formatted_timestamp()
        data["eventDate"] = get_event_date()
        
        success, _ = send_to_firebase(mpu_url, data)
        if not success:
            # Add back to queue if still failed
            if len(unsent_events) < MAX_UNSENT_EVENTS:
                unsent_events.append(data)
        time.sleep(0.5)  # Avoid overwhelming the server

# Initialize MPU6050
def init_mpu(i2c):
    try:
        # Wake up the MPU6050
        i2c.writeto_mem(MPU_ADDR, PWR_MGMT_1, b'\x00')
        time.sleep(0.1)
        print("MPU6050 initialized successfully")
        return True
    except Exception as e:
        print(f"Error initializing MPU6050: {e}")
        return False

# Read accelerometer data
def read_accel(i2c):
    try:
        data = i2c.readfrom_mem(MPU_ADDR, ACCEL_XOUT_H, 6)
        accel_x = (data[0] << 8 | data[1]) / 16384.0
        accel_y = (data[2] << 8 | data[3]) / 16384.0
        accel_z = (data[4] << 8 | data[5]) / 16384.0
        return accel_x, accel_y, accel_z
    except Exception as e:
        print(f"Error reading accelerometer: {e}")
        return 0, 0, 0

# Read gyroscope data
def read_gyro(i2c):
    try:
        data = i2c.readfrom_mem(MPU_ADDR, GYRO_XOUT_H, 6)
        gyro_x = (data[0] << 8 | data[1]) / 131.0
        gyro_y = (data[2] << 8 | data[3]) / 131.0
        gyro_z = (data[4] << 8 | data[5]) / 131.0
        return gyro_x, gyro_y, gyro_z
    except Exception as e:
        print(f"Error reading gyroscope: {e}")
        return 0, 0, 0

# Handle MPU6050 events
def handle_mpu_event(accel_data, gyro_data, movement_magnitude, event_type):
    global mpu_counter
    mpu_counter += 1
    
    # Create a unique event ID
    event_id = generate_event_id()
    
    accel_x, accel_y, accel_z = accel_data
    gyro_x, gyro_y, gyro_z = gyro_data
    
    # Get WiFi signal strength
    signal_strength = get_wifi_signal_strength()
    
    # Determine if this is an unusual movement (potential fall)
    is_unusual = movement_magnitude > UNUSUAL_MOVEMENT_THRESHOLD
    
    # Create a consistent data structure
    data = {
        # Device identification
        "deviceId": DEVICE_ID,
        "raspberryPiId": DEVICE_ID,  
        
        # Metadata
        "eventId": event_id,
        "testId": TEST_ID,
        "testVersion": TEST_VERSION,
        "testType": "Plan_B_Self_Test",
        
        # Sensor information
        "sensorType": "MPU6050",
        "sensorId": f"MPU_{DEVICE_ID[:8]}",  
        "sensorModel": "MPU6050",
        
        # Event details
        "eventType": event_type,
        "eventCount": mpu_counter,
        "timestamp": get_formatted_timestamp(),
        "eventDate": get_event_date(),  
        
        # Location information
        "location": "living_room",
        "position": "door_side_table",
        
        # Measurements
        "magnitude": round(movement_magnitude, 4),
        "movementDetected": movement_magnitude > MOVEMENT_THRESHOLD,
        "unusual_movement_alert_sent": is_unusual,
        
        # Detailed sensor data
        "acceleration": {
            "x": round(accel_x, 4),
            "y": round(accel_y, 4),
            "z": round(accel_z, 4)
        },
        "gyroscope": {
            "x": round(gyro_x, 4),
            "y": round(gyro_y, 4),
            "z": round(gyro_z, 4)
        },
        
        # Thresholds used
        "movementThreshold": MOVEMENT_THRESHOLD,
        "significantMovementThreshold": SIGNIFICANT_MOVEMENT_THRESHOLD,
        "unusualMovementThreshold": UNUSUAL_MOVEMENT_THRESHOLD,
        
        # Additional data
        "signalStrength": signal_strength,  
        "isSimulatedEvent": False
    }
    
    # Send to Firebase and get latency
    success, latency = send_to_firebase(mpu_url, data)
    
    if success:
        print(f"MPU event: {event_type} - Magnitude: {movement_magnitude:.2f} - Event ID: {event_id}")
        print(f"Latency: {latency:.2f}ms, Signal Strength: {signal_strength} dBm")
        
        # Only print full stats periodically to reduce console output
        if mpu_counter % 5 == 0 or is_unusual:  # Every 5th event or unusual events
            print(f"Test progress: {mpu_counter} events (Success: {success_count}, Failure: {failure_count})")
        
        if is_unusual:
            print("!!! UNUSUAL MOVEMENT DETECTED - Potential fall alert !!!")

def main():
    global movement_detected, last_significant_report, TEST_START_TIME, consecutive_errors
    
    # Record test start time
    TEST_START_TIME = get_formatted_timestamp()
    
    print("=== PLAN B TESTING: MPU6050 SENSOR ===")
    print(f"Device ID: {DEVICE_ID}")
    print(f"Test ID: {TEST_ID}")
    print(f"Starting at: {TEST_START_TIME}")
    print("Testing robust detection of movement patterns with performance metrics")
    
    # Set up watchdog timer
    try:
        wdt = machine.WDT(timeout=8000)  # 8 second timeout
        print("Watchdog timer started")
    except Exception as e:
        print(f"Watchdog setup failed: {e}")
        wdt = None
    
    # Initialize I2C and MPU6050
    i2c = I2C(0, scl=Pin(9), sda=Pin(8), freq=400000)
    
    # Check if MPU6050 is on the I2C bus
    devices = i2c.scan()
    mpu_present = MPU_ADDR in devices
    
    if mpu_present:
        print(f"MPU6050 found at address: 0x{MPU_ADDR:02x}")
        mpu_initialized = init_mpu(i2c)
    else:
        print("MPU6050 not found on I2C bus")
        print("Available devices:", [f"0x{d:02x}" for d in devices])
        return
    
    if not mpu_initialized:
        print("Failed to initialize MPU6050")
        return
    
    # Connect to WiFi
    wifi_connected = connect_to_wifi(WIFI_SSID, WIFI_PASSWORD)
    
    if not wifi_connected:
        print("Cannot continue without WiFi. Will attempt to reconnect periodically...")
    
    # Get initial signal strength
    signal_strength = get_wifi_signal_strength()
    print(f"Initial WiFi signal strength: {signal_strength} dBm")
    
    print("\nStarting MPU6050 monitoring with performance metrics...")
    print(f"Movement threshold: {MOVEMENT_THRESHOLD}")
    print(f"Significant movement threshold: {SIGNIFICANT_MOVEMENT_THRESHOLD}")
    print(f"Unusual movement threshold: {UNUSUAL_MOVEMENT_THRESHOLD}")
    print("Events will be logged to Firebase when:")
    print("1. Movement starts (crosses threshold)")
    print("2. Movement stops (falls below threshold)")
    print("3. Significant movements are detected")
    print("4. Unusual movements (potential falls) are detected")
    print("\nPerformance metrics being tracked:")
    print("- Data transmission latency (ms)")
    print("- WiFi signal strength (dBm)")
    print("- Success/failure rate")
    print("\nTesting protocol:")
    print("- Create various movement patterns (gentle, moderate, rapid)")
    print("- Test 50 different movement scenarios")
    print("- Record success/failure rate of event detection")
    
    # Get initial calibration
    print("\nCalibrating sensor - please keep it still...")
    # Take multiple readings and average them for a baseline
    sum_x, sum_y, sum_z = 0, 0, 0
    samples = 10
    
    for _ in range(samples):
        accel_x, accel_y, accel_z = read_accel(i2c)
        sum_x += accel_x
        sum_y += accel_y
        sum_z += accel_z
        time.sleep(0.1)
    
    # Calculate baseline average
    baseline_x = sum_x / samples
    baseline_y = sum_y / samples
    baseline_z = sum_z / samples
    
    print(f"Baseline acceleration: X={baseline_x:.2f}, Y={baseline_y:.2f}, Z={baseline_z:.2f}")
    print("Monitoring started. Move the sensor to generate events.")
    
    # Track timing for periodic tasks
    last_wifi_check = time.time()
    last_retry_time = time.time()
    
    # Main loop
    while True:
        # Feed the watchdog timer
        if wdt:
            wdt.feed()
            
        current_time = time.time()
        
        try:
            # Check WiFi periodically (every 5 minutes)
            if current_time - last_wifi_check > 300:
                if not network.WLAN(network.STA_IF).isconnected():
                    print("WiFi disconnected, attempting to reconnect...")
                    connect_to_wifi(WIFI_SSID, WIFI_PASSWORD)
                last_wifi_check = current_time
                
            # Retry unsent events periodically (every 30 seconds)
            if unsent_events and current_time - last_retry_time > 30:
                retry_unsent_events()
                last_retry_time = current_time
                
            # Read sensor data
            accel_data = read_accel(i2c)
            gyro_data = read_gyro(i2c)
            
            # Calculate movement magnitude relative to baseline
            accel_x, accel_y, accel_z = accel_data
            
            # Calculate vector magnitude of deviation from baseline
            accel_mag = math.sqrt(
                (accel_x - baseline_x)**2 + 
                (accel_y - baseline_y)**2 + 
                (accel_z - baseline_z)**2
            )
            
            # Print magnitude less frequently
            if mpu_counter % 10 == 0:
                print(f"Movement magnitude: {accel_mag:.2f}")
            
            # Detect movement events
            if accel_mag > MOVEMENT_THRESHOLD and not movement_detected:
                # Movement started
                movement_detected = True
                handle_mpu_event(accel_data, gyro_data, accel_mag, "movement_start")
                
            elif accel_mag <= MOVEMENT_THRESHOLD and movement_detected:
                # Movement stopped
                movement_detected = False
                handle_mpu_event(accel_data, gyro_data, accel_mag, "movement_stop")
                
            # Report significant movements periodically
            elif (accel_mag > SIGNIFICANT_MOVEMENT_THRESHOLD and 
                  current_time - last_significant_report > REPORT_INTERVAL):
                handle_mpu_event(accel_data, gyro_data, accel_mag, "significant_movement")
                last_significant_report = current_time
                
            # Detect unusual movements (potential falls) immediately
            elif accel_mag > UNUSUAL_MOVEMENT_THRESHOLD:
                handle_mpu_event(accel_data, gyro_data, accel_mag, "unusual_movement")
                last_significant_report = current_time  
            
            # Reset consecutive errors counter on successful iteration
            consecutive_errors = 0
            
        except Exception as e:
            consecutive_errors += 1
            print(f"Error reading MPU6050: {e} (Error #{consecutive_errors})")
            
            # Reset device if too many consecutive errors
            if consecutive_errors > 5:
                print("Too many consecutive errors. Restarting device...")
                time.sleep(1)
                machine.reset()
        
        # Free memory
        gc.collect()
        
        # Sleep before next reading
        time.sleep(READING_INTERVAL)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nProgram stopped by user")
        print(f"Test summary: {mpu_counter} events detected")
        print(f"Success rate: {success_count}/{mpu_counter} ({success_count/mpu_counter*100 if mpu_counter else 0:.1f}%)")
        
        # Print performance metrics summary
        if success_count > 0:
            avg_latency = total_latency / success_count
            print(f"Average latency: {avg_latency:.2f}ms")
            print(f"Min latency: {min_latency:.2f}ms")
            print(f"Max latency: {max_latency:.2f}ms")
            
        print(f"Unsent events: {len(unsent_events)}")
    except Exception as e:
        print(f"Program error: {e}")
        # Reset the device after 5 seconds
        print("Restarting device in 5 seconds...")
        time.sleep(5)
        machine.reset()