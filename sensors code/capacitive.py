from machine import Pin, RTC
import time
import urequests
import utime
import network
import gc
import machine
import random

try:
    import ntptime
except ImportError:
    # If not available, define a minimal version
    class NtpTime:
        timeout = 5
        def settime():
            print("ntptime module not available, skipping time sync")
    ntptime = NtpTime()

# it depends on which Wi-Fi you are connected to. This below are my Wi-Fi credentials.
WIFI_SSID = "ASK4 Wireless" 
WIFI_PASSWORD = None  

# Firebase Configuration
FIREBASE_BASE_URL = "https://assistant-living-app-default-rtdb.europe-west1.firebasedatabase.app"
MEDICATION_EVENTS_URL = f"{FIREBASE_BASE_URL}/medicationEventsTest.json"

# Get Device ID from Raspberry Pi Pico W hardware
def get_pico_w_id():
    unique_id = machine.unique_id()
    return ''.join(['{:02x}'.format(b) for b in unique_id])

# Device Identification
DEVICE_ID = get_pico_w_id()
TEST_ID = "PLANB_TEST_" + DEVICE_ID
TEST_VERSION = "1.0"
TEST_START_TIME = None

# Initialize capacitive touch sensor with pull-down resistor
capacitive = Pin(4, Pin.IN, Pin.PULL_DOWN)

# Global variables
last_missed_check_time = 0
missed_medication_logged_today = {}
DEBOUNCE_TIME = 0.5  
CHECK_INTERVAL = 30 

# Track which medication was last used for box opened events
last_medication_index = 0

MEDICATIONS = [
    {"id": "med1", "name": "Paracetamol", "time": "08:00"},
    {"id": "med2", "name": "Lisinopril", "time": "12:00"},
    {"id": "med3", "name": "Aspirin", "time": "18:00"},
    {"id": "med4", "name": "Simvastatin", "time": "22:00"},
    {"id": "med5", "name": "Metformin", "time": "09:30"},
    {"id": "med6", "name": "Amlodipine", "time": "20:00"},
    {"id": "med7", "name": "Vitamin D", "time": "10:15"},
    {"id": "med8", "name": "Atorvastatin", "time": "19:45"}
]

# Track test statistics
event_counter = 0
success_count = 0
failure_count = 0
total_latency = 0
max_latency = 0
min_latency = float('inf')

# Error recovery - store unsent events
unsent_events = []
MAX_UNSENT_EVENTS = 20  # Limit to prevent memory issues

def sync_time():
    """Synchronize the RTC with NTP server once WiFi is connected."""
    rtc = RTC()
    
    # Get current time before sync
    before_sync = rtc.datetime()
    print(f"Time before sync: {before_sync[0]}-{before_sync[1]:02d}-{before_sync[2]:02d} {before_sync[4]:02d}:{before_sync[5]:02d}:{before_sync[6]:02d}")
    
    # Set a reasonable default time in case NTP sync fails
    # This sets time to April 22, 2025
    if before_sync[0] < 2023: 
        rtc.datetime((2025, 4, 22, 1, 12, 0, 0, 0))
        print("Set default time to April 22, 2025")
    
    print("Attempting to sync time with NTP server...")
    
    try:
        # Try to connect to NTP server and update the time
        ntptime.timeout = 5  # 5 second timeout for NTP
        ntptime.settime()  # Synchronize with NTP server
        
        # Get and print the current time after sync
        current_time = rtc.datetime()
        print(f"Time synchronized: {current_time[0]}-{current_time[1]:02d}-{current_time[2]:02d} {current_time[4]:02d}:{current_time[5]:02d}:{current_time[6]:02d}")
        return True
    except Exception as e:
        print(f"Error syncing time: {e}")
        current_time = rtc.datetime()
        print(f"Using time: {current_time[0]}-{current_time[1]:02d}-{current_time[2]:02d} {current_time[4]:02d}:{current_time[5]:02d}:{current_time[6]:02d}")
        return False

def connect_to_wifi(ssid, password=None):
    """Connect to Wi-Fi network with retry mechanism and sync time."""
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    
    if not wlan.isconnected():
        print("Connecting to Wi-Fi...")
        retry_count = 0
        max_retries = 5
        
        while retry_count < max_retries and not wlan.isconnected():
            try:
                if password:
                    wlan.connect(ssid, password)
                else:
                    wlan.connect(ssid)
                
                # Wait for connection with timeout
                max_wait = 10
                while max_wait > 0 and not wlan.isconnected():
                    max_wait -= 1
                    print("Waiting for connection...")
                    time.sleep(1)
                
                if wlan.isconnected():
                    print("Connected to Wi-Fi:", wlan.ifconfig())
                    # Sync time with NTP server after connecting
                    sync_time()
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
            # Even if WiFi fails, set a reasonable default time
            rtc = RTC()
            if rtc.datetime()[0] < 2023:  # If year is really off
                rtc.datetime((2025, 4, 22, 1, 12, 0, 0, 0))
                print("Set default time to April 22, 2025 (WiFi failed)")
            return False
    else:
        print("Already connected to Wi-Fi:", wlan.ifconfig())
        # Even if already connected, still sync time
        sync_time()
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
    """Return ISO 8601 timestamp using device's local time."""
    # First check if time is valid
    rtc = RTC()
    current_time = rtc.datetime()
    current_year = current_time[0]
    
    # If year is before 2023, use a default time
    if current_year < 2023:
        print("Warning: Invalid system time detected when generating timestamp")
        # Set a reasonable default time
        rtc.datetime((2025, 4, 22, 1, 12, 0, 0, 0))
        print("Reset to default time: 2025-04-22")
        current_time = rtc.datetime()  # Get updated time
    
    # Format the timestamp
    t = current_time
    return "{:04d}-{:02d}-{:02d}T{:02d}:{:02d}:{:02d}Z".format(t[0], t[1], t[2], t[4], t[5], t[6])

def get_current_time_str():
    """Get current time as HH:MM string."""
    # Verify time is valid first
    rtc = RTC()
    t = rtc.datetime()
    if t[0] < 2023:  # If year is invalid
        rtc.datetime((2025, 4, 22, 1, 12, 0, 0, 0))
        t = rtc.datetime()  # Get updated time
    return "{:02d}:{:02d}".format(t[4], t[5])

def get_current_date():
    """Get current date as YYYY-MM-DD string."""
    # Verify time is valid first
    rtc = RTC()
    t = rtc.datetime()
    if t[0] < 2023:  # If year is invalid
        rtc.datetime((2025, 4, 22, 1, 12, 0, 0, 0))
        t = rtc.datetime()  # Get updated time
    return "{:04d}-{:02d}-{:02d}".format(t[0], t[1], t[2])

def generate_event_id():
    """Generate a unique event ID."""
    timestamp = utime.time()
    random_part = random.randint(10000, 99999)
    return f"med_{timestamp}_{random_part}_{DEVICE_ID[:8]}"

def send_to_firebase(url, data):
    """Send data to Firebase database with latency tracking and error handling."""
    global success_count, failure_count, total_latency, max_latency, min_latency, unsent_events
    
    # Debug: Validate timestamp before sending
    rtc = RTC()
    current_time = rtc.datetime()
    current_year = current_time[0]
    
    # Check for invalid timestamps (year before 2023)
    if current_year < 2023:
        print("WARNING: System time appears incorrect. Current year:", current_year)
        print("Attempting to reset time to default before sending data...")
        rtc.datetime((2025, 4, 22, 1, 12, 0, 0, 0))
        print("Set default time to April 22, 2025")
        
        # Also update any timestamps in the data
        if "timestamp" in data:
            data["timestamp"] = get_formatted_timestamp()
            print("Updated timestamp in data:", data["timestamp"])
        
        # Update Medication_Date if present
        if "Medication_Date" in data:
            data["Medication_Date"] = get_current_date()
            print("Updated Medication_Date in data:", data["Medication_Date"])
    
    # Debug: Print the fields we're troubleshooting
    print(f"Sending data with Medication_Date = {data.get('Medication_Date')}")
    
    # Start timing for latency measurement
    start_time = time.time()
    
    try:
        response = urequests.post(url, json=data)
        status_code = response.status_code
        
        # Calculate latency
        end_time = time.time()
        latency = (end_time - start_time) * 1000  # Convert to milliseconds
        
        # Update latency statistics
        total_latency += latency
        if latency > max_latency:
            max_latency = latency
        if latency < min_latency:
            min_latency = latency
        
        response.close()
        
        if 200 <= status_code < 300:
            print(f"Data sent successfully to Firebase. Latency: {latency:.2f}ms")
            success_count += 1
            return True, latency
        else:
            print(f"Error sending data to Firebase: HTTP status {status_code}")
            failure_count += 1
            if len(unsent_events) < MAX_UNSENT_EVENTS:
                unsent_events.append(data)
            return False, 0
            
    except Exception as e:
        print(f"Error sending data to Firebase: {e}")
        failure_count += 1
        if len(unsent_events) < MAX_UNSENT_EVENTS:
            unsent_events.append(data)
        return False, 0
    finally:
        gc.collect()  # Free memory

def retry_unsent_events():
    """Retry sending any unsent events."""
    global unsent_events
    
    if not unsent_events:
        return
        
    if not network.WLAN(network.STA_IF).isconnected():
        return 
        
    print(f"Attempting to resend {len(unsent_events)} unsent events...")
    
    # Make a copy to avoid modifying during iteration
    events_to_retry = unsent_events.copy()
    unsent_events = []
    
    for data in events_to_retry:
        # Update timestamps in case they were created with wrong time
        rtc = RTC()
        if rtc.datetime()[0] >= 2023: 
            if "timestamp" in data:
                data["timestamp"] = get_formatted_timestamp()
            if "Medication_Date" in data:
                data["Medication_Date"] = get_current_date()
        
        success, _ = send_to_firebase(MEDICATION_EVENTS_URL, data)
        if not success:
            # Add back to queue if still failed
            if len(unsent_events) < MAX_UNSENT_EVENTS:
                unsent_events.append(data)
        time.sleep(0.5)  # To avoid overwhelming the server

def check_missed_medications():
    """Check for missed medications and log events for testing."""
    global last_missed_check_time, missed_medication_logged_today, event_counter
    
    # Only check every CHECK_INTERVAL seconds
    current_time = utime.time()
    if current_time - last_missed_check_time < CHECK_INTERVAL:
        return
    
    last_missed_check_time = current_time
    
    # Use Medications data
    medications = MEDICATIONS
    
    if not medications:
        return
    
    print("\nChecking for missed medications...")
    current_time_str = get_current_time_str()
    current_timestamp = get_formatted_timestamp()
    current_date = get_current_date()
    
    # Randomly pick one medication to be "missed" - for testing
    random_med_index = random.randint(0, len(medications) - 1)
    med = medications[random_med_index]
    
    scheduled_time = med["time"]
    medication_name = med["name"]
    
    # Generate a unique key for each check
    log_key = f"{scheduled_time}_{current_date}_{current_time}"
    
    # Get WiFi signal strength
    signal_strength = get_wifi_signal_strength()
    
    # Check if this specific key has been logged before
    if log_key not in missed_medication_logged_today:
        # Log a missed medication event
        event_counter += 1
        event_id = generate_event_id()
        
        # Create full date format for scheduled time
        scheduled_full_date = f"{current_date}T{scheduled_time}:00Z"
        
        data = {
            # Device identification
            "deviceId": DEVICE_ID,
            "raspberryPiId": DEVICE_ID, 
            
            # Metadata
            "eventId": event_id,
            "testId": TEST_ID,
            "testType": "Plan_B_Self_Test", 
            "testVersion": TEST_VERSION,
            
            # Sensor information
            "sensorType": "capacitive", 
            "sensorId": f"CAP_{DEVICE_ID}",
            "sensorModel": "Touch_Sensor", 
            
            # Event details
            "eventCount": event_counter,
            "timestamp": current_timestamp,
            "eventType": "missed_dose",
            
            # Medication specific data
            "box_opened": False,
            "scheduledTime": scheduled_time,  
            "scheduledDateTime": scheduled_full_date, 
            "Medication_Date": current_date, 
            "adherenceStatus": "Missed",
            "medication_name": medication_name,
            "notification_sent": False,  
            
            # Performance metrics
            "signalStrength": signal_strength,
        }
        
        # Send to Firebase with latency tracking
        success, latency = send_to_firebase(MEDICATION_EVENTS_URL, data)
        
        if success:
            print(f"Logged missed medication: {medication_name} at {scheduled_time} - Event ID: {event_id}")
            print(f"Latency: {latency:.2f}ms, Signal Strength: {signal_strength} dBm")
            print(f"Test progress: {event_counter} events (Success: {success_count}, Failure: {failure_count})")
            
            # Mark this time slot as logged for today
            missed_medication_logged_today[log_key] = True

def handle_box_opened():
    """Handle when medication box is opened."""
    global event_counter, last_medication_index
    
    # Default values to prevent variable reference errors
    scheduled_time = "00:00"
    medication_name = "Unknown"
    adherence_status = "On-time"
    
    current_timestamp = get_formatted_timestamp()
    current_date = get_current_date()
    event_counter += 1
    event_id = generate_event_id()
    
    # Get WiFi signal strength
    signal_strength = get_wifi_signal_strength()
    
    # Cycle through medications in sequence to ensure variety
    last_medication_index = (last_medication_index + 1) % len(MEDICATIONS)
    med = MEDICATIONS[last_medication_index]
    
    scheduled_time = med["time"]
    medication_name = med["name"]
    
    # Create full date format for scheduled time
    scheduled_full_date = f"{current_date}T{scheduled_time}:00Z"
    
    # Get current time for adherence status
    current_time = get_current_time_str()
    current_hour, current_minute = map(int, current_time.split(':'))
    med_hour, med_minute = map(int, scheduled_time.split(':'))
    time_diff = abs((current_hour * 60 + current_minute) - (med_hour * 60 + med_minute))
    
    # Determine adherence status based on time difference
    if time_diff <= 15:
        adherence_status = "On-time"
    elif time_diff > 15 and time_diff < 60:
        adherence_status = "Late"
    else:
        adherence_status = random.choice(["On-time", "Late"])
    
    data = {
        # Device identification
        "deviceId": DEVICE_ID,
        "raspberryPiId": DEVICE_ID,
        
        # Metadata
        "eventId": event_id,
        "testId": TEST_ID,
        "testType": "Plan_B_Self_Test",
        "testVersion": TEST_VERSION,
        
        # Sensor information
        "sensorType": "capacitive",
        "sensorId": f"CAP_{DEVICE_ID}",
        "sensorModel": "Touch_Sensor", 
        
        # Event details
        "eventCount": event_counter,
        "timestamp": current_timestamp,
        "eventType": "medication_taken",  
        
        # Medication specific data
        "box_opened": True,
        "scheduledTime": scheduled_time,  
        "scheduledDateTime": scheduled_full_date,  
        "Medication_Date": current_date,  
        "adherenceStatus": adherence_status,
        "medication_name": medication_name,
        "notification_sent": False,  
        
        # Performance metrics
        "signalStrength": signal_strength,
    }
    
    # Send to Firebase with latency tracking
    success, latency = send_to_firebase(MEDICATION_EVENTS_URL, data)
    
    if success:
        print(f"Box opened - Medication taken: {medication_name} - Event ID: {event_id}")
        print(f"Latency: {latency:.2f}ms, Signal Strength: {signal_strength} dBm")
        print(f"Test progress: {event_counter} events (Success: {success_count}, Failure: {failure_count})")

def main():
    """Main function."""
    global TEST_START_TIME
    
    # Initialize RTC with a default time in case we can't sync
    rtc = RTC()
    if rtc.datetime()[0] < 2023:  # If year is invalid (< 2023)
        rtc.datetime((2025, 4, 22, 1, 12, 0, 0, 0))
        print("Set initial default time to April 22, 2025")
    
    # Record test start time
    TEST_START_TIME = get_formatted_timestamp()
    
    print("=== PLAN B TESTING: CAPACITIVE SENSOR (MEDICATION BOX) ===")
    print(f"Device ID: {DEVICE_ID}")
    print(f"Test ID: {TEST_ID}")
    print(f"Starting at: {TEST_START_TIME}")
    print("Testing medication box monitoring with performance metrics")
    
    if not connect_to_wifi(WIFI_SSID, WIFI_PASSWORD):
        print("Failed to connect to Wi-Fi, entering offline mode...")
        # Will attempt to reconnect periodically
    
    # Additional time check after WiFi connection attempt
    if rtc.datetime()[0] < 2023:  # If still invalid after connect_to_wifi
        rtc.datetime((2025, 4, 22, 1, 12, 0, 0, 0))
        print("Time still invalid, set to April 22, 2025")
    
    # Get initial signal strength
    signal_strength = get_wifi_signal_strength()
    print(f"Initial WiFi signal strength: {signal_strength} dBm")
    
    print(f"Using {len(MEDICATIONS)} medications for testing")
    
    # Get initial sensor state
    initial_state = capacitive.value()
    last_box_state = bool(initial_state)
    last_state_change = utime.time()
    print(f"Starting with sensor state: {last_box_state}")
    
    # If sensor is already HIGH at startup, wait for it to go LOW before triggering events
    if last_box_state:
        print("Sensor is already active - waiting for it to be released before monitoring...")
    
    last_wifi_check = utime.time()
    last_retry_time = utime.time()
    last_time_check = utime.time()
    
    print("\nStarting medication box monitoring...")
    print("\nPerformance metrics being tracked:")
    print("- Data transmission latency (ms)")
    print("- WiFi signal strength (dBm)")
    print("- Success/failure rate")
    print("\nTest protocol:")
    print("1. Touch the capacitive sensor to generate 'medication taken' events")
    print("2. The system will periodically generate 'missed medication' events")
    print("3. Target: Generate ~50 events for robust testing")
    print("\nSensor ready! Current pin state:", capacitive.value())
    
    # Configure watchdog for system recovery if code hangs
    try:
        wdt = machine.WDT(timeout=8000)  # 8 second timeout
    except Exception as e:
        print(f"Watchdog setup failed: {e}")
        wdt = None
    
    # Main loop
    while True:
        try:
            # Feed the watchdog if it exists
            if wdt:
                wdt.feed()
            
            # Periodically check if time is valid
            current_time = utime.time()
            if current_time - last_time_check > 300:  # Every 5 minutes
                if rtc.datetime()[0] < 2023: 
                    print("Invalid time detected in main loop, resetting...")
                    rtc.datetime((2025, 4, 22, 1, 12, 0, 0, 0))
                    print("Reset to default time: 2025-04-22")
                last_time_check = current_time
            
            # Read sensor (1 = touched/box opened, 0 = not touched/box closed)
            current_box_state = bool(capacitive.value())
            
            # Print pin state changes for debugging (only when they change)
            if current_box_state != last_box_state:
                print(f"Sensor state changed to: {current_box_state}")
            
            # Check for state change with debounce
            if current_box_state != last_box_state and (current_time - last_state_change) > DEBOUNCE_TIME:
                last_state_change = current_time
                
                if current_box_state:  # Box was opened (Pin HIGH)
                    print("\n>>> Touch detected! Processing event...")
                    handle_box_opened()
                else:
                    # Pin went LOW again, box was closed
                    print("Touch released")
                
                last_box_state = current_box_state
            
            # Periodically check for missed medications
            check_missed_medications()
            
            # Periodically check WiFi connection (every 5 minutes)
            if current_time - last_wifi_check > 300:
                if not network.WLAN(network.STA_IF).isconnected():
                    print("WiFi disconnected, attempting to reconnect...")
                    connect_to_wifi(WIFI_SSID, WIFI_PASSWORD)
                last_wifi_check = current_time
            
            # Retry unsent events every 30 seconds
            if unsent_events and current_time - last_retry_time > 30:
                retry_unsent_events()
                last_retry_time = current_time
                
            time.sleep(0.1)
            
        except Exception as e:
            print("Error in main loop:", e)
            time.sleep(5) 

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nProgram stopped by user")
        print(f"Test summary: {event_counter} events detected")
        print(f"Success rate: {success_count}/{event_counter} ({success_count/event_counter*100 if event_counter else 0:.1f}%)")
        
        # Print performance metrics summary
        if success_count > 0:
            avg_latency = total_latency / success_count
            print(f"Average latency: {avg_latency:.2f}ms")
            print(f"Min latency: {min_latency:.2f}ms")
            print(f"Max latency: {max_latency:.2f}ms")
        
        print(f"Unsent events: {len(unsent_events)}")
    except Exception as e:
        print("Fatal error:", e)
        # Reset the device after a fatal error
        time.sleep(5)
        machine.reset()