const express = require("express");
const admin = require("firebase-admin");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 5000;

// Firebase Admin Initialization
const serviceAccount = require("./service.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://assistant-living-app-default-rtdb.europe-west1.firebasedatabase.app",
});

const firestore = admin.firestore();
const realtimeDB = admin.database();

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

const sendNotification = async ({ to, title, body, priority = "default" }) => {
  try {
    const res = await axios.post(EXPO_PUSH_URL, {
      to,
      sound: "default",
      title,
      body,
      priority,
    });
    console.log(`✅ Notification sent to ${to}: ${title} - ${body}`);
    console.log("Expo Response:", res.data);
  } catch (err) {
    console.error("❌ Notification failed:", err.message);
  }
};

// Global cache
let usersByPiId = {};
let caregiverToken = null; // Caregiver token holder

const loadUsers = async () => {
  const usersSnapshot = await firestore.collection("Users").get();
  usersByPiId = {};
  caregiverToken = null;

  usersSnapshot.forEach((doc) => {
    const data = doc.data();

    // Cache caregiver token if user is caregiver
    if (data?.id === "caregiver@admin.com") {
      caregiverToken = data.Token;
      console.log("👤 Caregiver Token:", caregiverToken);
    }

    // Cache regular users
    const piIdArray = data?.RaspberrryPiID;
    if (Array.isArray(piIdArray) && data?.Token) {
      piIdArray.forEach((piId) => {
        usersByPiId[piId] = {
          Token: data.Token,
          name: data.Name || "User",
        };
      });
    }
  });

  console.log("👥 Users loaded into memory:", Object.keys(usersByPiId).length);
};


const processInactiveUsers = async (events) => {
  console.log('"🔄 Processing inactive users...");')
  const now = new Date();
  const nowTimestamp = now.getTime();
  const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
  const FIVE_MINUTES_MS = 5 * 60 * 1000;

  const latestEventByUser = {};

  // Step 1: Get the latest event per RaspberryPiId
  for (const eventId in events) {
    const event = events[eventId];
    const { raspberryPiId, timestamp } = event;

    if (!raspberryPiId || !timestamp) continue;

    const eventTime = new Date(timestamp).getTime();

    if (
      !latestEventByUser[raspberryPiId] ||
      eventTime > latestEventByUser[raspberryPiId].eventTime
    ) {
      latestEventByUser[raspberryPiId] = {
        ...event,
        eventTime,
      };
    }
  }

  // Step 2: Process each user's latest event
  for (const piId in latestEventByUser) {
    const event = latestEventByUser[piId];
    const user = usersByPiId[piId];
    if (!user) continue;

    const timeSinceLastMovement = nowTimestamp - event.eventTime;

    if (
      event.movementDetected === false &&
      timeSinceLastMovement >= TWO_HOURS_MS
    ) {
      // If event is also within 5 minutes (latest record)
      const isRecentEvent =
        timeSinceLastMovement <= TWO_HOURS_MS + FIVE_MINUTES_MS;

      if (isRecentEvent) {
        await sendNotification({
          to: user.Token,
          title: "No Movement Detected",
          body: `No movement detected for over 2 hours. Please check in.`,
          data: {
            type: "inactivity",
            timestamp: new Date(event.eventTime).toISOString(),
          },
        });

        await sendNotification({
          to: caregiverToken,
          title: "No Movement Detected",
          body: `No movement detected from ${user.Name} for over 2 hours. Please check in.`,
          priority: "high",
          sound:'default',

          data: {
            type: "inactivity",
            timestamp: new Date(event.eventTime).toISOString(),
          },
        });

        console.log(`📭 Inactivity alert sent to ${user.Name || piId}`);
      }
    }
  }
};

const processMedicationEvents = async (events) => {
  const nowUTC2 = new Date();
nowUTC2.setSeconds(0, 0);
  // Correct way to get 'YYYY-MM-DD'
  const today = nowUTC2.toISOString();
  const todayDateString = nowUTC2.toISOString().split("T")[0];
  console.log("todayDateString is", todayDateString);

  for (const eventId in events) {
    const event = events[eventId];
    const {
      Medication_Date,
      scheduledDateTime,
      scheduledTime,
      medication_name,
      box_opened,
      takenTime,
      raspberryPiId,
    } = event;

    // 🔍 Only process today's events
    if (Medication_Date !== todayDateString) continue;

    const user = usersByPiId[raspberryPiId];
    if (!user || !scheduledTime) continue;

    const medTimeUTC = new Date(scheduledDateTime);
    medTimeUTC.setSeconds(0, 0);

    const diff = (nowUTC2 - medTimeUTC) / 1000;
    console.log(
      "the diff is",
      diff,
      "and the medTimeUTC is",
      medTimeUTC,
      "and the nowUTC is",
      nowUTC2,
      "name",
      medication_name
    );
    if (!box_opened) {
      const eventRef = realtimeDB.ref(`medicationEventsTest/${eventId}`);
      const upcomingnotificationAlreadySent = event.upcomingNotificationSent;
      const timetotakenotificationAlreadySent =
        event.timetotakenotificationAlreadySent;
      const missednotificationAlreadySent = event.missednotificationAlreadySent;
      const medicinenottakennotificationAlreadySent =
        event.medicinenottakennotificationAlreadySent;

          let sound = 'default';
            let channelId = 'notification-channel-default';
      if (!upcomingnotificationAlreadySent && diff > -600 && diff < -480) {
        console.log("⏳ Sending upcoming notification");
        await sendNotification({
          to: user.Token,
          title: "Upcoming Medication",
          body: `You need to take ${medication_name} in 10 minutes.`,
          data: {
            type: "Medication",
          },
          priority: "low",
           sound,
           channelId:'notification-channel-upcoming-medication',
        });

        // Set the flag to avoid duplicate notifications
        await eventRef.update({ upcomingNotificationSent: true });
      } else if (!timetotakenotificationAlreadySent && Math.abs(diff) < 60) {
        console.log("⏰ Sending take-now notification");
        await sendNotification({
          to: user.Token,
          title: "Time to Take Medication",
          body: `Please take ${medication_name} now.`,
          data: {
            type: "Medication",
          },
          priority: "high",
           sound,
           channelId:'notification-channel-time-medication',
        });
        await eventRef.update({ timetotakenotificationAlreadySent: true });
      } else if (
        !medicinenottakennotificationAlreadySent &&
        diff > 600 &&
        diff < 1200 &&
        caregiverToken
      ) {
        console.log("⚠️ Sending late notification to caregiver");
        await sendNotification({
          to: caregiverToken,
          title: "Medication Not Taken",
          body: `${user.name} has not taken ${medication_name} on time.`,
          priority: "high",
          data: {
            type: "Medication",
          },
           sound,
           channelId:'notification-channel-nottaken-medication',
        });
        await eventRef.update({
          medicinenottakennotificationAlreadySent: true,
        });
      } else if (diff > 1800 && !missednotificationAlreadySent) {
        console.log("❌ Sending missed notification");
        await sendNotification({
          to: user.Token,
          title: "Missed Medication",
          body: `You missed ${medication_name}.`,
          priority: "medium",
          data: {
            type: "Medication",
          },
           sound,
           channelId:'notification-channel-missed-medication',
        });

        if (caregiverToken) {
          await sendNotification({
            to: caregiverToken,
            title: "Missed Medication",
            body: `${user.name} has missed ${medication_name}.`,
            priority: "medium",
            data: {
              type: "Medication",
            },
             sound,
           channelId:'notification-channel-missed-medication',
          });
        }
        await eventRef.update({ missednotificationAlreadySent: true });
      }
    } else if (takenTime) {
      const takennotificationAlreadySent = event.takennotificationAlreadySent;
      const takenDateTime = new Date(takenTime);
      const takenDelay = (takenDateTime - medTimeUTC) / (60 * 1000); // in minutes

      if (takenDelay < 10 && !takennotificationAlreadySent) {
        await sendNotification({
          to: user.Token,
          title: "Medication Taken",
          body: `You took ${medication_name} on time.`,
          priority: "low",
          data: {
            type: "Medication",
          },
        });
        await eventRef.update({ takennotificationAlreadySent: true });
      } else {
        await sendNotification({
          to: user.Token,
          title: "Medication Taken Late",
          body: `${medication_name} was taken ${Math.round(
            takenDelay
          )} minutes late.`,
          priority: "medium",
          data: {
            type: "Medication",
          },
        });
        await eventRef.update({ takennotificationAlreadySent: true });
      }
    }
  }
};

// Real-time listener
const listenToMedicationEvents = () => {
  const ref = realtimeDB.ref("medicationEventsTest");

  ref.on(
    "value",
    async (snapshot) => {
      const events = snapshot.val();
      if (!events) {
        console.log("❌ No medication events found");
        return;
      }
      console.log("🔄 Medication events changed. Processing...");
      await loadUsers();
      await processMedicationEvents(events);
    },
    (error) => {
      console.error("❌ Firebase real-time listener error:", error);
    }
  );
};

// Start listener
// Periodic medication checker (every 1 minute)
setInterval(async () => {
  console.log("🕒 Periodic check for medication events...");
  try {
    await loadUsers(); // Refresh user tokens just in case
    const snapshot = await realtimeDB.ref("medicationEventsTest").once("value");
    const events = snapshot.val();

    const snapshot2 = await realtimeDB.ref("mpuEventsTest").once("value");
    const events2 = snapshot2.val();
    if (events2) {
      await processInactiveUsers(events2);
    } else {
      console.log("⚠️ No inactive users found during periodic check.");
    }
    if (events) {
      await processMedicationEvents(events);
    } else {
      console.log("⚠️ No medication events found during periodic check.");
    }
  } catch (error) {
    console.error("❌ Error during periodic check:", error.message);
  }
}, 30 * 1000); // every 30 seconds

app.get("/", (req, res) => {
  res.send("✅ Real-time notification server is running");
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
