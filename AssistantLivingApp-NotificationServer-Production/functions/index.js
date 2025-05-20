// Import the modular SDK
const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");

const serviceAccount = require("./service.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://assistant-living-app-default-rtdb.europe-west1.firebasedatabase.app" // <-- important
});


const firestore = admin.firestore();
const realtimeDB = admin.database();
const messaging = admin.messaging(); // FCM
const twilio = require('twilio');

// Initialize client with your Twilio credentials
const twilioClient = twilio('AC7ba7abf0d10c425477db1b01a5b345f3', '3b2bd53a9073a85a2cc88d60eabdc335');

// 🔔 Send FCM Notification
const sendNotification = async ({ to, title, body, priority = "high", data = {}, channelId = "default" }) => {
  console.log('📤 Sending notification:', { to, title, body, priority, data, channelId });

  try {
    await messaging.send({
      token: to,
      notification: {
        title,
        body,
      },
      android: {
        priority,
        notification: {
          channelId,         // ✅ Must match the one set up in Expo
          sound: "default",  // ✅ Always "default" here — actual sound depends on channelId on device
        },
      },
      data: {
        ...data,
        sound: data.sound || "default", // optional, just for custom handling in app logic
      },
    });

    console.log(`✅ Notification sent to ${to}: ${title} - ${body}`);
  } catch (err) {
    console.error("❌ Notification failed:", err.message);
  }
};



// 🧠 In-Memory Cache
let usersByPiId = {};
let caregiverToken = null;


async function loadUsers() {
  const snapshot = await firestore.collection("Users").get();
  snapshot.forEach((doc) => {
    const data = doc.data();
 if (data?.Category === 'Caregiver') {
console.log('first caregiver token is', data.Token);
      caregiverToken = data.Token;
    }
    const piIdArray = data?.RaspberrryPiID; // Corrected spelling
    const Token = data?.Token;
    const name = data?.Name;
    const RaspberrryPiID = data?.RaspberrryPiID;
    console.log('Name is', name);
  console.log('usersByPiId map:', piIdArray); // Debug output

    if (Array.isArray(piIdArray)) {
      piIdArray.forEach((id) => {
        const idStr = String(id); // Ensure string key
        if (!usersByPiId[idStr]) {
          usersByPiId[idStr] = [];
        }
        usersByPiId[idStr].push({ Token, name, RaspberrryPiID });
      });
    }
  });

}


// 🚨 Inactivity Checker
const processInactiveUsers = async (events) => {
      let caregivertoken = null;
  console.log('caregiver token i med 1', caregivertoken);
    const snapshot = await firestore.collection("Users").get();
  snapshot.forEach((doc) => {
    const data = doc.data();
 if (data?.Category === 'Caregiver') {
console.log('first caregiver token is', data.Token);
      caregivertoken = data.Token;
    }
  });
  const now = Date.now();
  const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
  
  const FIVE_MINUTES_MS = 5 * 60 * 1000;

  const latestByUser = {};

  // Step 1: Track the latest event per raspberryPiId
  for (const eventId in events) {
    const event = events[eventId];
    const { raspberryPiId, timestamp } = event;
    if (!raspberryPiId || !timestamp) continue;

    const eventTime = new Date(timestamp).getTime();
    if (
      !latestByUser[raspberryPiId] ||
      eventTime > latestByUser[raspberryPiId].eventTime
    ) {
      latestByUser[raspberryPiId] = { ...event, eventTime, eventId };
    }
  }

  // Step 2: Evaluate each user's latest event
  for (const piId in latestByUser) {
    const event = latestByUser[piId];
    const { raspberryPiId, eventTime, eventId } = event;

    let user = null;

    // Find user based on RaspberryPiID
    for (const userId in usersByPiId) {
      const userArray = usersByPiId[userId];
      if (Array.isArray(userArray)) {
        for (const u of userArray) {
          if (
            Array.isArray(u.RaspberrryPiID) &&  // ✅ Typo fixed
            u.RaspberrryPiID.includes(raspberryPiId)
          ) {
            console.log('Matching user found:', u);
            user = u;
            break;
          }
        }
      }
      if (user) break;
    }

    if (!user) continue;
    console.log('user is', user);

    const sinceLast = now - eventTime;
    console.log('sinceLast', sinceLast);
    const isRecent = sinceLast >= (TWO_HOURS_MS);
console.log('isRecent', isRecent);
console.log('user is before', user)
console.log('event is before', event)
    if (
      // event?.movementDetected === false &&
      // sinceLast >= TWO_HOURS_MS &&
      isRecent &&
      event?.inactivity_alert_sent === false
    ) {
console.log('user is', user)
      const eventRef = realtimeDB.ref(`mpuEventsTest/${eventId}`);

      sendAlert( "Inactivity Detected📭", `No movement detected from ${user.Name || user.id || piId} for over 2 hours.`);
      // Send alert to user
      await sendNotification({
        to: user.Token,
        title: "No Movement Detected📭",
        body: "No movement detected for over 2 hours. Please check in.",
        data: {
          type: "inactivity",
          title: "No Movement Detected 📭",
          body: "No movement detected for over 2 hours. Please check in.",
          priority: "high",
      
          Timestamp :new Date().toISOString(),

        },
        channelId: 'no_movement_channel',
        sound: 'No-Movement',
      });

      // Send alert to caregiver (if available)
      if (caregivertoken) {
        await sendNotification({
          to: caregivertoken,
          title: "Inactivity Detected📭",
          body: `No movement detected from ${user.Name || user.id || piId} for over 2 hours.`,
          priority: "high",
          data: {
            type: "inactivity",
                                Timestamp :new Date().toISOString(),

            title: "Inactivity Detected 📭",
          body: `No movement detected from ${user.Name || user.id || piId} for over 2 hours.`,
          priority: "high",
          },
          channelId: 'no_movement_channel',
          sound: 'No-Movement',
        });
      }

      // Mark alert as sent in DB
      await eventRef.update({ inactivity_alert_sent: true });

      console.log(`📭 Inactivity alert sent for ${user.Name || piId}`);
    }
  }
};


const processUnusualActivity = async (events) => {
    let caregivertoken = null;
  console.log('caregiver token i med 1', caregivertoken);
    const snapshot = await firestore.collection("Users").get();
  snapshot.forEach((doc) => {
    const data = doc.data();
 if (data?.Category === 'Caregiver') {
console.log('first caregiver token is', data.Token);
      caregivertoken = data.Token;
    }
  });
  const latestByUser = {};

  // Step 1: Get latest event per raspberryPiId
  for (const eventId in events) {
    const event = events[eventId];
    const { raspberryPiId, timestamp } = event;
    if (!raspberryPiId || !timestamp) continue;

    const eventTime = new Date(timestamp).getTime();
    if (
      !latestByUser[raspberryPiId] ||
      eventTime > latestByUser[raspberryPiId].eventTime
    ) {
      latestByUser[raspberryPiId] = { ...event, eventTime, eventId };
    }
  }

  // Step 2: Loop through latest events and send notifications if needed
  for (const piId in latestByUser) {
    const event = latestByUser[piId];
    const { raspberryPiId, eventId } = event;
    let user = null;

    // Match user from usersByPiId
    for (const userId in usersByPiId) {
      const userArray = usersByPiId[userId];
      if (Array.isArray(userArray)) {
        for (const u of userArray) {
          if (
            Array.isArray(u.RaspberrryPiID) && // ✅ Fixed typo here
            u.RaspberrryPiID.includes(raspberryPiId)
          ) {
            console.log('Matching user found:', u);
            user = u;
            break;
          }
        }
      }
      if (user) break;
    }

    if (!user) continue;

    const eventRef = realtimeDB.ref(`mpuEventsTest/${eventId}`);

    // Step 3: Check for unusual movement and send notifications
    if (
      event.eventType === 'unusual_movement' &&
      event.unusual_movement_alert_sent === false
    ) {
      console.log('Unusual movement detected:', event);
      sendAlert( "Alert: Unusual Movement", `Unusual movement detected from ${user.name || user.id}.`);

      await sendNotification({
        to: user.Token,
        title: "Unusual Movement Detected",
        body: "An unusual movement has been detected. Please check your surroundings.",
        data: {
          type: "unusual_movement",
            title: "Unusual Movement Detected",
        body: "An unusual movement has been detected. Please check your surroundings.",
                  Timestamp :new Date().toISOString(),

          priority: "high",
        },
        channelId: 'unusual_movement_channel',
        sound: 'Unusual-Movement',
      });

      if (caregivertoken) {
        await sendNotification({
          to: caregivertoken,
          title: "Alert: Unusual Movement",
          body: `Unusual movement detected from ${user.name || user.id}.`,
          priority: "high",
          data: {
            type: "unusual_movement",
              title: "Unusual Movement Detected",
        body: "An unusual movement has been detected. Please check your surroundings.",
            timestamp: new Date(event.eventTime).toISOString(),
          },
          channelId: 'unusual_movement_channel',
          sound: 'Unusual-Movement',
        });
      }

      // Mark alert as sent in database
      await eventRef.update({ unusual_movement_alert_sent: true });
      console.log(`🚨 Unusual movement alert sent for ${user.Name || piId}`);
    }
  }
};


const processBedActivity = async (events) => {
  let caregivertoken = null;
  console.log('caregiver token i med 1', caregivertoken);
    const snapshot = await firestore.collection("Users").get();
  snapshot.forEach((doc) => {
    const data = doc.data();
 if (data?.Category === 'Caregiver') {
console.log('first caregiver token is', data.Token);
      caregivertoken = data.Token;
    }
  });
  const latestByUser = {};
console.log('caregiver token i 2', caregivertoken);
  console.log('usersByPiId', usersByPiId);

  // Step 1: Get latest event per raspberryPiId
  for (const eventId in events) {
    const event = events[eventId];
    const { raspberryPiId, timestamp } = event;
    if (!raspberryPiId || !timestamp) continue;

    const eventTime = new Date(timestamp).getTime();
    if (
      !latestByUser[raspberryPiId] ||
      eventTime > latestByUser[raspberryPiId].eventTime
    ) {
      latestByUser[raspberryPiId] = { ...event, eventTime, eventId };
    }
  }

  // Step 2: Process each latest event
  for (const piId in latestByUser) {
    const event = latestByUser[piId];
    const { raspberryPiId, eventId } = event;
    let user = null;

    // Find user linked to this Raspberry Pi
    for (const userId in usersByPiId) {
      const userArray = usersByPiId[userId];
      if (Array.isArray(userArray)) {
        for (const u of userArray) {
          if (
            Array.isArray(u.RaspberrryPiID) &&  // ✅ Fixed typo
            u.RaspberrryPiID.includes(raspberryPiId)
          ) {
            console.log('Matching user found:', u);
            user = u;
            break;
          }
        }
      }
      if (user) break;
    }

    if (!user) continue;

    const eventRef = realtimeDB.ref(`pressureEventsTest/${eventId}`);

    const diff = (new Date() - new Date(event.timestamp)) / 1000;
    if (
      event?.location === 'bed' && diff > 32400 && // 9 hours
      event?.unusual_sleep_alert_sent === false
    ) {

      sendAlert( "Alert: Unusual Sleep Pattern", `Unusual sleep pattern detected from ${user.Name || user.id}.`);
      // Send notification to user
      await sendNotification({
        to: user.Token,
        title: "Unusual Sleep Pattern Detected",
        body: "You have been detected in bed for an unusual amount of time.",
        priority: "high",
        data: {
          type: "unusual_sleep",
            title: "Unusual Sleep Pattern Detected",
        body: "You have been detected in bed for an unusual amount of time.",
        priority: "high",
            Timestamp :new Date().toISOString(),

        },
        channelId: 'unusual_sleep_channel',
        sound: 'Unusual-Sleep',
      });
console.log('caregiver token i 2', caregivertoken);
      // Send notification to caregiver if token exists
      if (caregivertoken) {
        await sendNotification({
          to: caregivertoken,
          title: "Unusual Sleep Pattern Detected",
          body: `${user.Name || 'A user'} has been in bed unusually long.`,
          priority: "high",
          data: {
            type: "unusual_sleep",
                      title: "Unusual Sleep Pattern Detected",
          body: `${user.Name || 'A user'} has been in bed unusually long.`,
          priority: "high",
            timestamp: new Date(event.eventTime).toISOString()
          },
          channelId: 'unusual_sleep_channel',
          sound: 'Unusual-Sleep',
        });
      }

      // Update the event to mark alert as sent
      await eventRef.update({ unusual_sleep_alert_sent: true });

      console.log(`🚨 Unusual sleep alert sent for ${user.Name || piId}`);
    }
  }
};



// 💊 Medication Events Handler
const processMedicationEvents = async (events) => {
  let caregivertoken = null;
  console.log('caregiver token i med 1', caregivertoken);
    const snapshot = await firestore.collection("Users").get();
  snapshot.forEach((doc) => {
    const data = doc.data();
 if (data?.Category === 'Caregiver') {
console.log('first caregiver token is', data.Token);
      caregivertoken = data.Token;
    }
  });
  const nowUTC = new Date();
  nowUTC.setSeconds(0, 0);
  const todayDate = nowUTC.toISOString().split("T")[0];

  for (const eventId in events) {
    const event = events[eventId];
    const {
      Medication_Date,
      scheduledDateTime,
      scheduledTime,
      missednotificationAlreadySent,
      medication_name,
      box_opened,
      takenTime,
      adherenceStatus,
      raspberryPiId,
      upcomingNotificationSent,
      timetotakenotificationAlreadySent,
      takennotificationAlreadySent,
    } = event;
    if (!scheduledDateTime || isNaN(new Date(scheduledDateTime).getTime())) {
  console.warn(`⚠️ Skipping event ${eventId} due to invalid scheduledDateTime:`, scheduledDateTime);
  continue;
}

console.log('name of medication is', medication_name);
    console.log('scheduledDateTime', scheduledDateTime);
    const medDate = new Date(scheduledDateTime).toISOString().split("T")[0];
    if (medDate !== todayDate) continue;
    console.log('raspberryPiId', raspberryPiId);
 let user = null;
 for (const userId in usersByPiId) {
  const userArray = usersByPiId[userId];
  if (Array.isArray(userArray)) {
    for (const u of userArray) {
      if (Array.isArray(u.RaspberrryPiID) && u.RaspberrryPiID.includes(raspberryPiId)) {
        console.log('matching user found', u);
        user = u;
        break;
      }
    }
  }

  if (user) break;
}

    console.log('user is', user, 'medication name is', medication_name);
    console.log ('caregiverToken is', caregivertoken);

    if (!user || !scheduledTime )  continue;

    const medTime = new Date(scheduledDateTime);
    medTime.setSeconds(0, 0);
    console.log('first medTime', medTime);
    console.log('nowUTC', nowUTC);
    const diff = (nowUTC - medTime)/1000
    console.log('diff is', diff, 'medname is', medication_name);
    const eventRef = realtimeDB.ref(`medicationEventsTest/${eventId}`);

    if (!box_opened) {
      if (!upcomingNotificationSent && diff > -660 && diff < -540) {
        console.log('in upcomingNotificationSent');
        await sendNotification({
          to: user.Token,
          title: "Upcoming Medication💊",
          body: `You need to take ${medication_name} in 10 minutes.`,
          priority: "high",
          data: { 
            type: "Medication" ,
             title: "Upcoming Medication💊",
          body: `You need to take ${medication_name} in 10 minutes.`,
            Timestamp :new Date().toISOString(),

            priority:'low',
          sound: 'Upcoming-Medication',
          channelId: 'upcoming_medication_channel',
          },
             channelId: 'upcoming_medication_channel',
        });
        await eventRef.update({ upcomingNotificationSent: true });
      } 
      
      else if (!timetotakenotificationAlreadySent && Math.abs(diff) < 61 && diff > -61) {
        await sendNotification({
          to: user.Token,
          title: "Time to Take Medication💊",
          body: `Please take ${medication_name} now.`,
          priority: "high",
          data: { type: "Medication",
            Timestamp :new Date().toISOString(),
  title: "Time to Take Medication💊",
          body: `Please take ${medication_name} now.`,
              priority:'high',
          sound: 'Take-Medication',
          channelId: 'take_medication_channel',

           },
           channelId: 'take_medication_channel',
          
        });
        console.log('sending notification', { to: user.Token, title: "Time to Take Medication", body: `Please take ${medication_name} now.` });
        await eventRef.update({ timetotakenotificationAlreadySent: true });
      }

        else if (!missednotificationAlreadySent && adherenceStatus=='Missed') {
        await sendNotification({
          to: caregivertoken,
          title: `MISSED MEDICATION 💊`,
          body: `${user.name} has missed a Medication💊`,
          priority: "high",
          data: { type: "Medication",
            Timestamp :new Date().toISOString(),
  title: "Time to Take Medication💊",
          body: `Please take ${medication_name} now.`,
              priority:'medium',
          sound: 'default',
          channelId: 'default',

           },
           channelId: 'default',
          
        });
        console.log('sending notification', { to: caregivertoken, title: "missed Medication", body: `Please take ${medication_name} now.` });
        await eventRef.update({ missednotificationAlreadySent: true });
      }
    } else if (takenTime && !takennotificationAlreadySent) {
      const takenDateTime = new Date(takenTime);
      const delay = (takenDateTime - medTime) / 60000;

      if (delay < 10) {
        await sendNotification({
          to: user.Token,
          title: "Medication Taken💊",
          body: `You took ${medication_name} on time.`,
          priority: "high",
          data: { type: "Medication",
              title: "Medication Taken💊",
          body: `You took ${medication_name} on time.`,
            Timestamp :new Date().toISOString(),
              priority:'low',
          sound: 'Taken-Medication',
          channelId: 'taken_medication_channel',

           },
          channelId: 'taken_medication_channel',

        });
      } else {
        await sendNotification({
          to: user.Token,
          title: "Medication Taken Late💊",
          body: `${medication_name} was taken ${Math.round(delay)} minutes late.`,
          priority: "high",
          data: { type: "Medication",
            Timestamp :new Date().toISOString(),
 title: "Medication Taken Late💊",
          body: `${medication_name} was taken ${Math.round(delay)} minutes late.`,
               priority:'low',
          sound: 'Taken-Medication',
          channelId: 'taken_medication_channel',
           },
          channelId: 'taken_medication_channel',

        });

          await sendNotification({
          to: caregiverToken,
          title: "Medication Taken Late💊",
          body: ` ${medication_name} was taken ${Math.round(delay)} minutes late by ${user.name}.`,
          priority: "high",
          data: { type: "Medication",
            Timestamp :new Date().toISOString(),
 title: "Medication Taken Late💊",
          body: ` ${medication_name} was taken ${Math.round(delay)} minutes late by ${user.name}.`,
               priority:'low',
          sound: 'Taken-Medication',
          channelId: 'taken_medication_channel',
           },
          channelId: 'taken_medication_channel',

        });
      }

      await eventRef.update({ takennotificationAlreadySent: true });
    }
  }
};

async function sendAlert( messageTitle, messageBody) {
  console.log('Sending alert:', messageTitle, messageBody);
  await sendSMS('caregiver@admin.com', `${messageTitle}: ${messageBody}`);
}

async function sendSMS(userId, message) {
  const userDoc = await firestore.collection("Users").doc(userId).get();
  const userData = userDoc.data();

  if (userData && userData.Contact) {
    try {
      const response = await twilioClient.messages.create({
        from: "+447360496577",
        to: userData.Contact || '+447440328260',
        body: message,
      });

      // ✅ Log successful message SID and recipient
      console.log(`✅ SMS sent successfully to ${response.to}. Message SID: ${response.sid}`);
    } catch (error) {
      console.error("❌ Twilio SMS error:", error.message);
    }
  } else {
    console.warn("⚠️ No phone number found for user:", userId);
  }
}



// 🕒 Periodic check for inactivity
exports.processInactiveUsersv2 = onSchedule({
   schedule: "* * * * *", // Set to every minute, change if needed
   timeZone: "Europe/Brussels", // Fixed time zone name
}, async () => {
  await loadUsers();
  const snapshot = await realtimeDB.ref("mpuEventsTest").once("value");
  const events = snapshot.val();
  if (events) {
    await processInactiveUsers(events);
  } else {
    console.log("⚠️ No mpuEvents found.");
  }
});


exports.processUnusualActivity = onSchedule({
   schedule: "* * * * *", // Set to every minute, change if needed
   timeZone: "Europe/Brussels", // Fixed time zone name
}, async () => {
  await loadUsers();
  const snapshot = await realtimeDB.ref("mpuEventsTest").once("value");
  const events = snapshot.val();
  if (events) {
    await processUnusualActivity(events);
  } else {
    console.log("⚠️ No mpuEvents found.");
  }
});

exports.processBedSleep = onSchedule({
   schedule: "* * * * *", // Set to every minute, change if needed
   timeZone: "Europe/Brussels", // Fixed time zone name
}, async () => {
  await loadUsers();
  const snapshot = await realtimeDB.ref("pressureEventsTest").once("value");
  const events = snapshot.val();
  if (events) {
    await processBedActivity(events);
  } else {
    console.log("⚠️ No mpuEvents found.");
  }
});

// 🔄 Realtime Database trigger for medication events
exports.processMedicationEventsv2 = onSchedule({
   schedule: "* * * * *", // Set to every minute, change if needed
   timeZone: "Europe/Brussels", // Fixed time zone name
}, async () => {
  await loadUsers();
  const snapshot = await realtimeDB.ref("medicationEventsTest").once("value");
  const events = snapshot.val();
  if (events) {
    await processMedicationEvents(events);
  } else {
    console.log("⚠️ No medicationEvents found.");
  }
});




