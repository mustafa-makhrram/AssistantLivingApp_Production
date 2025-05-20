import { get, ref } from 'firebase/database';
import { db } from '../../../firebaseConfig';

/**
 * Fetches all medication events from Realtime Database.
 * @returns {Promise<Array>} - Returns an array of medications.
 */
const fetchAllBedStatus = async () => {
  try {
    const medRef = ref(db, 'pressureEventsTest');
    const snapshot = await get(medRef);

    if (!snapshot.exists()) {
      return []; 
    }

    const data = snapshot.val();

    const meds = Object.entries(data).map(([id, value]) => ({
      id,
      ...value,
    }));

    meds.sort((a, b) => b.timestamp - a.timestamp);
    return meds;

  } catch (error) {
    console.error('Error fetching medication events:', error.message);
    throw new Error('Failed to fetch medication events.');
  }
};

export default fetchAllBedStatus;
