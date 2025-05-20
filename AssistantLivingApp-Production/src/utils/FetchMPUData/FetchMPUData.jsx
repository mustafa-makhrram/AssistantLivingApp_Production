import { get, ref } from 'firebase/database';
import { db } from '../../../firebaseConfig'; 

/**
 * @returns {Promise<Array>} - Returns an array of medications.
 */
const fetchMPUData = async () => {
  try {
    const medRef = ref(db, 'mpuEventsTest');
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

    return meds;

  } catch (error) {
    console.error('Error fetching medication events:', error.message);
    throw new Error('Failed to fetch medication events.');
  }
};

export default fetchMPUData;
