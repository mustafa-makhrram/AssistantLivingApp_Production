import { get, ref } from 'firebase/database';
import { db } from '../../../firebaseConfig'; // path to your config

/**
 * Fetches all medication events from Realtime Database.
 * @returns {Promise<Array>} - Returns an array of medications.
 */
const fetchAllRoomStatus = async () => {
  try {
    const medRef = ref(db, 'motionEventsTest');
    const snapshot = await get(medRef);

    if (!snapshot.exists()) {
      return []; // No data found
    }

    const data = snapshot.val();

    // Convert object to array and include IDs
    const meds = Object.entries(data).map(([id, value]) => ({
      id,
      ...value,
    }));

    // Optional: Sort by timestamp descending if needed
    meds.sort((a, b) => b.timestamp - a.timestamp);
// console.log('All medications:', meds);
    return meds;

  } catch (error) {
    console.error('Error fetching medication events:', error.message);
    throw new Error('Failed to fetch medication events.');
  }
};

export default fetchAllRoomStatus;
