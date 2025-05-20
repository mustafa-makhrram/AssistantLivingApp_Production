from machine import Pin, ADC
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
PRESSURE_URL = f"{FIREBASE_BASE_URL}/pressureEventsTest.json"

# Get Device ID from Raspberry Pi Pico W hardware
def get_pico_w_id():
    unique_id = machine.unique_id()
    return ubinascii.hexlify(unique_id).decode()

# Device Identification
DEVICE_ID = get_pico_w_id()
TEST_ID = "PLANB_TEST_" + DEVICE_ID
TEST_VERSION = "1.0"
TEST_START_TIME = None

# Setup the ADC on GPIO 26 (which is ADC0)
pressure_adc = ADC(26)

# Thresholds & Settings
PRESSURE_THRESHOLD = 50  # percentage threshold for occupancy detection
READING_INTERVAL = 5  # seconds between readings
SIGNIFICANT_CHANGE_THRESHOLD = 20  # percentage change to trigger a new event

# Initialize variables
pressure_counter = 0
last_pressure_percentage = 0
area_occupied = False
success_count = 0
failure_count = 0
total_latency = 0
max_latency = 0
min_latency = float('inf')

# Test locations for cycling through
LOCATIONS = ["bed", "chair"]
current_location_index = 0

def connect_to_wifi(ssid, password=None):
    """Connect to Wi-Fi."""
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
            return None  # In case the method isn't supported
    return None

def get_formatted_timestamp():
    """Return ISO 8601 timestamp using device's local time."""
    t = utime.localtime()
    return "{:04d}-{:02d}-{:02d}T{:02d}:{:02d}:{:02d}Z".format(t[0], t[1], t[2], t[3], t[4], t[5])

def get_current_date():
    """Return current date as YYYY-MM-DD."""
    t = utime.localtime()
    return "{:04d}-{:02d}-{:02d}".format(t[0], t[1], t[2])

# Generate a unique event ID
def generate_event_id():
    random_bytes = bytearray(4)
    for i in range(len(random_bytes)):
        random_bytes[i] = random.randint(0, 255)
    timestamp = utime.time()
    return f"press_{timestamp}_{ubinascii.hexlify(random_bytes).decode()}"

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

def handle_pressure_event(pressure_value, location="bed", event_type="update"):
    """
    Process pressure reading and send event to Firebase.
    
    Args:
        pressure_value: Raw ADC value (0-65535)
        location: 'bed' or 'chair'
        event_type: 'occupied', 'vacant', or 'update'
    """
    global pressure_counter, last_pressure_percentage
    pressure_counter += 1
    
    # Convert raw ADC value (0-65535) into a percentage (0-100)
    pressure_percentage = (pressure_value / 65535) * 100
    pressure_percentage = round(pressure_percentage, 2)
    
    # Create unique event ID
    event_id = generate_event_id()
    
    # Get WiFi signal strength
    signal_strength = get_wifi_signal_strength()
    
    # Get current timestamp and date
    timestamp = get_formatted_timestamp()
    event_date = get_current_date()
    
    # Determine if occupied based on threshold
    is_occupied = pressure_percentage > PRESSURE_THRESHOLD
    
    # Status message based on event type
    status = "occupied" if is_occupied else "vacant"
    
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
        "sensorType": "pressure",
        "sensorId": f"PRESS_{DEVICE_ID[:8]}",  
        "sensorModel": "FSR_Sensor",
        
        # Event details
        "eventCount": pressure_counter,
        "timestamp": timestamp,
        "eventType": event_type,
        "eventDate": event_date, 
        
        # Pressure specific data
        "pressureValue": pressure_percentage, 
        "rawValue": pressure_value,
        "status": status,
        
        # Location information
        "location": location,
        "position": f"{location}_center",
        
        # Performance metrics
        "signalStrength": signal_strength,
        
        # Additional data
        "threshold": PRESSURE_THRESHOLD,
        "significantChangeThreshold": SIGNIFICANT_CHANGE_THRESHOLD,
        "batteryLevel": None,
        "isSimulatedEvent": False
    }
    
    # Send to Firebase with latency tracking
    success, latency = send_to_firebase(PRESSURE_URL, data)
    
    if success:
        print(f"Pressure event: {event_type.upper()} - {location} {status} - {pressure_percentage:.1f}% - Event ID: {event_id}")
        print(f"Date: {event_date}")
        print(f"Latency: {latency:.2f}ms, Signal Strength: {signal_strength} dBm")
        print(f"Test progress: {pressure_counter} events (Success: {success_count}, Failure: {failure_count})")
    
    last_pressure_percentage = pressure_percentage
    return is_occupied

def main():
    global area_occupied, current_location_index, TEST_START_TIME
    
    # Record test start time
    TEST_START_TIME = get_formatted_timestamp()
    
    print("=== PLAN B TESTING: PRESSURE SENSOR ===")
    print(f"Device ID: {DEVICE_ID}")
    print(f"Test ID: {TEST_ID}")
    print(f"Starting at: {TEST_START_TIME}")
    print("Testing robust detection of bed/chair occupancy with performance metrics")
    
    # Connect to WiFi
    connect_to_wifi(WIFI_SSID, WIFI_PASSWORD)
    
    # Get initial signal strength
    signal_strength = get_wifi_signal_strength()
    print(f"Initial WiFi signal strength: {signal_strength} dBm")
    
    print("\nStarting pressure sensor monitoring with performance metrics...")
    print(f"Occupancy threshold: {PRESSURE_THRESHOLD}%")
    print(f"Significant change threshold: {SIGNIFICANT_CHANGE_THRESHOLD}%")
    print("Events will be logged to Firebase when:")
    print("1. Area becomes occupied (crosses threshold)")
    print("2. Area becomes vacant (falls below threshold)")
    print("3. Significant change in pressure while occupied")
    print("\nPerformance metrics being tracked:")
    print("- Data transmission latency (ms)")
    print("- WiFi signal strength (dBm)")
    print("- Success/failure rate")
    print("\nTest protocol:")
    print("- Apply and remove pressure ~50 times")
    print("- Alternate between bed and chair locations")
    print("- Record success/failure rate of event detection")
    
    # Main loop
    while True:
        try:
            # Read the ADC value (0 - 65535)
            pressure_value = pressure_adc.read_u16()
            
            # Calculate pressure percentage
            pressure_percentage = (pressure_value / 65535) * 100
            
            # Get current test location
            current_location = LOCATIONS[current_location_index]
            
            # Determine event type
            if pressure_percentage > PRESSURE_THRESHOLD and not area_occupied:
                # Area became occupied
                area_occupied = True
                handle_pressure_event(pressure_value, current_location, "occupied")
                
            elif pressure_percentage <= PRESSURE_THRESHOLD and area_occupied:
                # Area became vacant
                area_occupied = False
                handle_pressure_event(pressure_value, current_location, "vacant")
                
                # Toggle location for next reading
                current_location_index = (current_location_index + 1) % len(LOCATIONS)
                
            elif abs(pressure_percentage - last_pressure_percentage) > SIGNIFICANT_CHANGE_THRESHOLD:
                # Significant change in pressure
                handle_pressure_event(pressure_value, current_location, "update")
                
            else:
                print(f"Current pressure: {pressure_percentage:.1f}% ({current_location}) - {'Occupied' if area_occupied else 'Vacant'}")
            
            # Free memory
            gc.collect()
            
            # Wait before next reading
            time.sleep(READING_INTERVAL)
            
        except Exception as e:
            print(f"Error reading pressure sensor: {e}")
            time.sleep(5)  # Longer delay on error
            
if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nProgram stopped by user")
        print(f"Test summary: {pressure_counter} events detected")
        print(f"Success rate: {success_count}/{pressure_counter} ({success_count/pressure_counter*100 if pressure_counter else 0:.1f}%)")
        
        # Print performance metrics summary
        if success_count > 0:
            avg_latency = total_latency / success_count
            print(f"Average latency: {avg_latency:.2f}ms")
            print(f"Min latency: {min_latency:.2f}ms")
            print(f"Max latency: {max_latency:.2f}ms")
    except Exception as e:
        print(f"Program error: {e}")