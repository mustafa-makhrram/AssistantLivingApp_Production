from machine import Pin
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
ultrasonic_url = f"{FIREBASE_BASE_URL}/ultrasonicEventsTest.json"

# Pins for the ultrasonic sensor
TRIG_PIN = 14
ECHO_PIN = 15

# Thresholds & Settings
DISTANCE_THRESHOLD = 50  # cm
READING_INTERVAL = 2  # seconds between readings (increased to reduce Firebase writes)

# Get Device ID from Raspberry Pi Pico W hardware
def get_pico_w_id():
    unique_id = machine.unique_id()
    return ubinascii.hexlify(unique_id).decode()

# Device Identification
DEVICE_ID = get_pico_w_id()
TEST_ID = "PLANB_TEST_" + DEVICE_ID
TEST_VERSION = "1.0"
TEST_START_TIME = None

# Initialize counters
ultrasonic_counter = 0
last_distance = 0
object_detected = False
success_count = 0
failure_count = 0
total_latency = 0
max_latency = 0
min_latency = float('inf')

# Connect to WiFi
def connect_to_wifi(ssid, password=""):
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print("Connecting to Wi-Fi...")
        wlan.connect(ssid, password)
        # Wait for connection with timeout
        max_wait = 10
        while max_wait > 0 and not wlan.isconnected():
            max_wait -= 1
            time.sleep(1)
        
    if wlan.isconnected():
        print("Connected to Wi-Fi:", wlan.ifconfig())
        return True
    else:
        print("Failed to connect to WiFi")
        return False

# Get WiFi signal strength
def get_wifi_signal_strength():
    wlan = network.WLAN(network.STA_IF)
    if wlan.isconnected():
        try:
            return wlan.status('rssi')  # Return RSSI in dBm
        except:
            return None  # In case the method isn't supported
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
    return f"ultra_{timestamp}_{ubinascii.hexlify(random_bytes).decode()}"

# Send data to Firebase with latency tracking
def send_to_firebase(url, data):
    global success_count, failure_count, total_latency, max_latency, min_latency
    
    # Start timing for latency measurement
    start_time = time.time()
    
    try:
        response = urequests.post(url, json=data)
        
        # Calculate latency
        end_time = time.time()
        latency = (end_time - start_time) * 1000  # Convert to milliseconds
        
        # Update latency statistics
        total_latency += latency
        if latency > max_latency:
            max_latency = latency
        if latency < min_latency:
            min_latency = latency
            
        print(f"Data sent successfully to Firebase. Latency: {latency:.2f}ms")
        response.close()
        success_count += 1
        gc.collect()  # Help manage memory
        return True, latency
    except Exception as e:
        print(f"Error sending data to Firebase: {e}")
        failure_count += 1
        return False, 0

# Read ultrasonic sensor
def read_ultrasonic(trig_pin, echo_pin):
    # Standard HC-SR04 routine
    trig_pin.value(0)
    time.sleep_us(2)
    trig_pin.value(1)
    time.sleep_us(10)
    trig_pin.value(0)
    
    # Wait for ECHO to go high, then measure time until it goes low
    start = utime.ticks_us()
    while echo_pin.value() == 0:
        if utime.ticks_diff(utime.ticks_us(), start) > 30000:  # 30ms timeout
            return None
    start = utime.ticks_us()
    while echo_pin.value() == 1:
        if utime.ticks_diff(utime.ticks_us(), start) > 30000:  # 30ms timeout (5m max)
            return None
    end = utime.ticks_us()
    
    duration = utime.ticks_diff(end, start)
    dist_cm = (duration * 0.0343) / 2
    
    # Filter out invalid readings
    if dist_cm < 2 or dist_cm > 400:
        return None
        
    return round(dist_cm, 1)

# Handle ultrasonic events
def handle_ultrasonic_event(distance, event_type):
    global ultrasonic_counter
    ultrasonic_counter += 1
    
    # Create a unique event ID
    event_id = generate_event_id()
    
    # Get WiFi signal strength
    signal_strength = get_wifi_signal_strength()
    
    # Create event timestamp
    current_timestamp = get_formatted_timestamp()
    
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
        "sensorType": "ultrasonic",
        "sensorId": f"ULTRA_{DEVICE_ID[:8]}",  
        "sensorModel": "HC-SR04",
        
        # Event details
        "eventType": event_type,
        "eventCount": ultrasonic_counter,
        "timestamp": current_timestamp,
        "eventDate": get_event_date(),  
        
        # Location information
        "location": "living_room",
        "position": "door_entrance",
        
        # Measurements
        "distance": distance,
        "unit": "cm",
        "threshold": DISTANCE_THRESHOLD,
        
        # State information
        "objectDetected": distance < DISTANCE_THRESHOLD,
        
        # Performance metrics
        "signalStrength": signal_strength,
        
        # Additional data
        "isSimulatedEvent": False
    }
    
    # Send to Firebase with latency tracking
    success, latency = send_to_firebase(ultrasonic_url, data)
    
    if success:
        print(f"Ultrasonic event: {event_type} - Distance: {distance} cm - Event ID: {event_id}")
        print(f"Latency: {latency:.2f}ms, Signal Strength: {signal_strength} dBm")
        
        # Print test statistics
        print(f"Test progress: {ultrasonic_counter} events (Success: {success_count}, Failure: {failure_count})")

def main():
    global last_distance, object_detected, TEST_START_TIME
    
    # Record test start time
    TEST_START_TIME = get_formatted_timestamp()
    
    print("=== PLAN B TESTING: ULTRASONIC SENSOR ===")
    print(f"Device ID: {DEVICE_ID}")
    print(f"Test ID: {TEST_ID}")
    print(f"Starting at: {TEST_START_TIME}")
    print("Testing robust detection of object movements with performance metrics")
    
    # Initialize ultrasonic pins
    trig = Pin(TRIG_PIN, Pin.OUT)
    echo = Pin(ECHO_PIN, Pin.IN)
    
    # Connect to WiFi
    wifi_connected = connect_to_wifi(WIFI_SSID, WIFI_PASSWORD)
    
    if not wifi_connected:
        print("Cannot continue without WiFi. Exiting.")
        return
    
    # Get initial signal strength
    signal_strength = get_wifi_signal_strength()
    print(f"Initial WiFi signal strength: {signal_strength} dBm")
    
    print("\nStarting ultrasonic sensor monitoring with performance metrics...")
    print(f"Detection threshold: {DISTANCE_THRESHOLD} cm")
    print("Events will be logged to Firebase when:")
    print("1. Object approaches closer than threshold")
    print("2. Object moves farther than threshold")
    print("3. Significant change in distance (>20%)")
    print("\nPerformance metrics being tracked:")
    print("- Data transmission latency (ms)")
    print("- WiFi signal strength (dBm)")
    print("- Success/failure rate")
    print("\nTesting protocol:")
    print("- Move object closer/further 50 times to cross threshold")
    print("- Record success/failure rate of event detection")
    print("- Generate Firebase logs for each detected event")
    
    # Get initial distance reading
    initial_distance = read_ultrasonic(trig, echo)
    if initial_distance:
        last_distance = initial_distance
        print(f"Initial distance: {last_distance} cm")
        object_detected = last_distance < DISTANCE_THRESHOLD
    else:
        last_distance = 100  # Default fallback
        print("Failed to get initial distance reading, using default 100cm")
        object_detected = False
    
    # Main loop
    while True:
        # Read ultrasonic sensor
        distance = read_ultrasonic(trig, echo)
        if distance is not None:
            print(f"Distance: {distance} cm", end="")
            
            # Detect significant changes
            if last_distance is not None:
                # Object approaching (crossing threshold)
                if distance < DISTANCE_THRESHOLD and last_distance >= DISTANCE_THRESHOLD:
                    print(f" - EVENT: Object approaching (crossed {DISTANCE_THRESHOLD}cm threshold)")
                    object_detected = True
                    handle_ultrasonic_event(distance, "approach")
                    
                # Object moving away (crossing threshold)
                elif distance >= DISTANCE_THRESHOLD and last_distance < DISTANCE_THRESHOLD:
                    print(f" - EVENT: Object retreating (crossed {DISTANCE_THRESHOLD}cm threshold)")
                    object_detected = False
                    handle_ultrasonic_event(distance, "retreat")
                    
                # Significant change in distance (more than 20%)
                elif abs(distance - last_distance) > (last_distance * 0.2):
                    event_type = "closer" if distance < last_distance else "farther"
                    print(f" - EVENT: Object moving {event_type} (significant change)")
                    handle_ultrasonic_event(distance, event_type)
                else:
                    print("")
            
            last_distance = distance
        else:
            print("Ultrasonic reading failed or out of range")
        
        # Free memory
        gc.collect()
        
        # Sleep before next reading
        time.sleep(READING_INTERVAL)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nProgram stopped by user")
        print(f"Test summary: {ultrasonic_counter} events detected")
        print(f"Success rate: {success_count}/{ultrasonic_counter} ({success_count/ultrasonic_counter*100 if ultrasonic_counter else 0:.1f}%)")
        
        # Print performance metrics summary
        if success_count > 0:
            avg_latency = total_latency / success_count
            print(f"Average latency: {avg_latency:.2f}ms")
            print(f"Min latency: {min_latency:.2f}ms")
            print(f"Max latency: {max_latency:.2f}ms")
    except Exception as e:
        print(f"Program error: {e}")