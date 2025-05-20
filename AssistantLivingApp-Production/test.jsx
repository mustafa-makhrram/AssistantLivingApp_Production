// server.js
const express = require('express');
const admin = require('firebase-admin');
const cron = require('node-cron');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 5000;

// Firebase Admin SDK Initialization
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://<your-project-id>.firebaseio.com',
});

const db = admin.firestore();

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

// Send notification to user
const sendNotification = async ({ to, title, body, priority = 'default' }) => {
  try {
    await axios.post(EXPO_PUSH_URL, {
      to,
      sound: 'default',
      title,
      body,
      priority,
    });
    console.log(`Notification sent to ${to}`);
  } catch (err) {
    console.error('Notification failed:', err.message);
  }
};

// Medication Reminder and Alert Checker
const checkMedications = async () => {
  const now = new Date();

  const usersSnapshot = await db.collection('Users').get();

  for (const userDoc of usersSnapshot.docs) {
    const userData = userDoc.data();
    const userId = userDoc.id;
    const expoToken = userData.expoPushToken;

    const medsSnapshot = await db
      .collection('Users')
      .doc(userId)
      .collection('Medications')
      .get();

    medsSnapshot.forEach(async (medDoc) => {
      const med = medDoc.data();
      const medTime = new Date(med.scheduledTime);
      const taken = med.taken;

      const diff = (now - medTime) / 1000; // seconds

      if (!taken) {
        if (diff > 600 && diff < 1200) {
          // 10 min late
          await sendNotification({
            to: expoToken,
            title: 'Medication Late',
            body: `${med.name} was not taken on time.`,
            priority: 'high',
          });
        } else if (diff > 1800) {
          // Missed dose
          await sendNotification({
            to: expoToken,
            title: 'Missed Medication',
            body: `You missed ${med.name}.`,
            priority: 'high',
          });
        } else if (diff > -600 && diff < 0) {
          // 10-min advance reminder
          await sendNotification({
            to: expoToken,
            title: 'Upcoming Medication',
            body: `You need to take ${med.name} in 10 minutes.`,
          });
        } else if (Math.abs(diff) < 60) {
          // On-time reminder
          await sendNotification({
            to: expoToken,
            title: 'Time to Take Medication',
            body: `Please take ${med.name} now.`,
          });
        }
      } else {
        // Optionally notify about taken on time or late
        const takenTime = new Date(med.takenTime);
        const takenDelay = (takenTime - medTime) / 60 / 1000;

        if (takenDelay < 10) {
          await sendNotification({
            to: expoToken,
            title: 'Medication Taken',
            body: `You took ${med.name} on time.`,
          });
        } else {
          await sendNotification({
            to: expoToken,
            title: 'Medication Taken Late',
            body: `${med.name} was taken ${Math.round(takenDelay)} minutes late.`,
          });
        }
      }
    });
  }
};

// Run every 5 minutes
cron.schedule('*/5 * * * *', checkMedications);

app.get('/', (req, res) => {
  res.send('Notification server is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
