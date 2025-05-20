This Repository contains 4 types of source codes.

1. React native expo Mobile App
React native Expo App :
To run the mobile app , you have to run following commands,
Run :
- npm install
- npx expo install
- npx expo run:android

2. Firebase Functions Server for Notifications
- processMedicationEventv2
- processInactiveUsersv2
- processBedSleep
- processUnusualActivity


4. Sensor Testing Visualizations
React components used to generate performance analysis charts based on sensor testing data. These visualizations were used in the project report to demonstrate system reliability and performance metrics.

5. Sensors Code
MicroPython implementation for the various sensors integrated with Raspberry Pi Pico W microcontrollers:

- capacitive.py: Monitors medication box interactions using a capacitive touch sensor
- MPU-6050.py: Detects movement patterns including start, stop, significant, and unusual movements
- PIR_motion.py: Tracks room occupancy through entry and exit event detection
- pressure.py: Monitors bed/chair usage through pressure sensing
- ultrasonic.py: Measures object proximity with approach/retreat detection

Each sensor module includes:
- Configuration variables and pin setups
- Firebase connectivity for real-time data transmission
- Error handling and recovery mechanisms
- Performance metric collection (latency, success rates)
- Automatic data buffering during connectivity loss
