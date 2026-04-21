🩺 Assistant Living App

A full-stack mobile application designed to support elderly and disabled individuals by monitoring daily activities and providing real-time alerts using IoT sensors.

📱 Overview

The Assistant Living App is a smart healthcare solution that combines mobile development, IoT sensors, and cloud services to improve independent living.

The system tracks user activity (movement, sleep, medication usage) and sends alerts when unusual behavior is detected.

🚀 Key Features
📲 Mobile App (React Native - Expo)
Medication reminders and notifications
Real-time updates from sensors
User-friendly interface for monitoring
☁️ Backend (Firebase Functions)
Real-time data processing
Automated alert system for unusual activity
Cloud-based event handling
📡 IoT Sensor Integration (Raspberry Pi Pico W)
Motion detection (PIR sensor)
Sleep and pressure monitoring
Movement analysis (MPU-6050)
Medication box interaction tracking
Distance detection (ultrasonic sensor)
📊 Data Visualization
Sensor performance analysis
Reliability metrics and system evaluation

🛠️ Technologies Used
React Native (Expo)
Firebase Realtime Database & Functions
Node.js
MicroPython (Raspberry Pi Pico W)
JavaScript

📂 Project Structure
Mobile App → React Native frontend
Firebase Functions → Backend logic and notifications
Sensors Code → MicroPython scripts for IoT devices
Visualizations → Performance analysis tools

▶️ How to Run the App
npm install  
npx expo install  
npx expo run:android  

💡 My Contribution
Designed and developed the mobile application
Integrated Firebase for real-time data handling
Implemented IoT sensor communication
Built system logic for alerts and monitoring
Conducted testing and performance evaluation

📌 Future Improvements
Full Android native version (Kotlin/Java)
Machine learning for behavior prediction
Enhanced UI/UX design
Real-time caregiver dashboard
