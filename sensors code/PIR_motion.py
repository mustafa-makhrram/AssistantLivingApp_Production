from machine import Pin
import time
import urequests
import utime
import network
import gc
import ubinascii
import machine
import random

# it depends on which Wi-Fi you are connected to. This below are my Wi-Fi credentials.
WIFI_SSID = "ASK4 Wireless" 
WIFI_PASSWORD = None

# Firebase URL
FIREBASE_BASE_URL = "https://assistant-living-app-default-rtdb.europe-west1.firebasedatabase.app"
motion_url = f"{FIREBASE_BASE_URL}/motionEventsTest.json"

# Get Device ID from Raspberry Pi Pico W hardware
def get_pico_w_id():
    unique_id = machine.unique_id()
    return ubinascii.hexlify(unique_id).decode()

# Device Identification
DEVICE_ID = get_pico_w_id()
TEST_ID = "PLANB_TEST_" + DEVICE_ID
TEST_VERSION = "1.0"
TEST_START_TIME = None

# Initialize motion sensor
pir_sensor = Pin(11, Pin.IN)  # PIR motion sensor on GPIO 11

# Configuration
WARMUP_TIME = 30  # Reduced warmup time for testing
ROOM_VACANCY_TIMEOUT = 30  # Consider room vacant after 30 seconds of no motion

# Room monitoring variables
motion_counter = 0
room_occupied = False
last_motion_time = 0
success_count = 0
failure_count = 0
total_latency = 0
max_latency = 0
min_latency = float('inf')

# Room locations for testing
ROOM_LOCATIONS = ["bedroom", "living_room", "kitchen", "bathroom"]
current_room_index = 0

def connect_to_wifi(ssid, password=None):
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print("Connecting to Wi-Fi...")
        if password:
            wlan.connect(ssid, password)
        else:
            wlan.connect(ssid)
        # Wait for connection with timeout
        max_wait = 10
        while max_wait > 0 and not wlan.isconnected():
            max_wait -= 1
            time.sleep(1)
        
        if wlan.isconnected():
            print("Connected to Wi-Fi:", wlan.ifconfig())
            return True
        else:
            print("Failed to connect to Wi-Fi")
            return False
    else:
        print("Already connected to Wi-Fi:", wlan.ifconfig())
        return True

# Get WiFi signal strength
def get_wifi_signal_strength():
    wlan = network.WLAN(network.STA_IF)
    if wlan.isconnected():
        try:
            return wlan.status('rssi')  # Return RSSI in dBm
        except:
            return None  
    return None

def get_formatted_timestamp():
    t = utime.localtime()
    return "{:04d}-{:02d}-{:02d}T{:02d}:{:02d}:{:02d}Z".format(t[0], t[1], t[2], t[3], t[4], t[5])

def get_current_date():
    t = utime.localtime()
    return "{:04d}-{:02d}-{:02d}".format(t[0], t[1], t[2])

# Generate a unique event ID
def generate_event_id():
    random_bytes = bytearray(4)
    for i in range(len(random_bytes)):
        random_bytes[i] = random.randint(0, 255)
    timestamp = utime.time()
    return f"motion_{timestamp}_{ubinascii.hexlify(random_bytes).decode()}"

# Send data to Firebase with test tracking and latency measurement
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

def handle_room_event(event_type, duration=0):
    global motion_counter, current_room_index
    motion_counter += 1
    
    # Rotate through rooms for testing
    location = ROOM_LOCATIONS[current_room_index]
    current_room_index = (current_room_index + 1) % len(ROOM_LOCATIONS)
    
    # Create a unique event ID
    event_id = generate_event_id()
    
    # Get WiFi signal strength
    signal_strength = get_wifi_signal_strength()
    
    # Get current timestamp and date
    timestamp = get_formatted_timestamp()
    event_date = get_current_date()
    
    # Determine confidence level based on event type
    confidence = 100 if event_type == "entry" else 95
    
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
        "sensorType": "motion",
        "sensorId": f"PIR_{DEVICE_ID[:8]}",  
        "sensorModel": "HC-SR501",
        
        # Event details
        "eventCount": motion_counter,
        "timestamp": timestamp,
        "eventType": event_type,
        "eventDate": event_date,  
        
        # Motion specific data
        "motionDetected": True,
        "roomOccupied": room_occupied,
        "duration": duration,
        
        # Location information
        "location": location,
        "position": "doorway",
        
        # Performance metrics
        "signalStrength": signal_strength,
        
        # Additional data
        "confidence": confidence,
        "isSimulatedEvent": False
    }
    
    # Send to Firebase with latency tracking
    success, latency = send_to_firebase(motion_url, data)
    
    if success:
        print(f"Room {location} {event_type}! Event #{motion_counter} - Event ID: {event_id}")
        print(f"Date: {event_date}")
        print(f"Latency: {latency:.2f}ms, Signal Strength: {signal_strength} dBm")
        print(f"Test progress: {motion_counter} events (Success: {success_count}, Failure: {failure_count})")
        if duration > 0:
            print(f"Duration in room: {duration} seconds")

def main():
    global room_occupied, last_motion_time, TEST_START_TIME
    
    # Record test start time
    TEST_START_TIME = get_formatted_timestamp()
    
    print("=== PLAN B TESTING: PIR MOTION SENSOR ===")
    print(f"Device ID: {DEVICE_ID}")
    print(f"Test ID: {TEST_ID}")
    print(f"Starting at: {TEST_START_TIME}")
    print("Testing robust detection of room occupancy with performance metrics")
    
    connect_to_wifi(WIFI_SSID, WIFI_PASSWORD)
    
    # Get initial signal strength
    signal_strength = get_wifi_signal_strength()
    print(f"Initial WiFi signal strength: {signal_strength} dBm")
    
    print(f"\nCalibrating sensor - please ensure room is empty for {WARMUP_TIME} seconds...")
    time.sleep(WARMUP_TIME)
    
    print("\nStarting room occupancy monitoring with performance metrics...")
    print("\nPerformance metrics being tracked:")
    print("- Data transmission latency (ms)")
    print("- WiFi signal strength (dBm)")
    print("- Success/failure rate")
    print("\nTest protocol:")
    print("1. Create ~50 motion events in different locations")
    print("2. Test both entry and exit events")
    print("3. Record success/failure rate of event detection")
    print("4. Track room occupancy duration")
    print("\nReady to detect room entry/exit events")
    
    previous_motion_state = False
    entry_time = 0
    
    while True:
        current_time = time.time()
        motion_value = pir_sensor.value()
        
        # New motion detected
        if motion_value and not previous_motion_state:
            if not room_occupied:
                room_occupied = True
                entry_time = current_time
                handle_room_event("entry")
                print("\nRoom Entry Detected!")
            last_motion_time = current_time
            
        # Check for room vacancy
        elif room_occupied and (current_time - last_motion_time) > ROOM_VACANCY_TIMEOUT:
            room_occupied = False
            duration = int(current_time - entry_time)
            handle_room_event("exit", duration)
            print(f"\nRoom Exit Detected! Duration in room: {duration} seconds")
        
        previous_motion_state = motion_value
        
        # Free memory
        gc.collect()
        
        # Brief pause to prevent busy waiting
        time.sleep(0.5)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nProgram stopped by user")
        print(f"Test summary: {motion_counter} events detected")
        print(f"Success rate: {success_count}/{motion_counter} ({success_count/motion_counter*100 if motion_counter else 0:.1f}%)")
        
        # Print performance metrics summary
        if success_count > 0:
            avg_latency = total_latency / success_count
            print(f"Average latency: {avg_latency:.2f}ms")
            print(f"Min latency: {min_latency:.2f}ms")
            print(f"Max latency: {max_latency:.2f}ms")
    except Exception as e:
        print(f"Program error: {e}")