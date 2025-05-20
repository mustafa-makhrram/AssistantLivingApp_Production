import { get, ref } from 'firebase/database';
import { db } from '../../../firebaseConfig';

/**
 * Fetches all medication events for today, sorted by the closest upcoming time.
 * @returns {Promise<Array>} - Returns an array of medications scheduled for today.
 */
const fetchAllMedicines = async () => {
  try {
    const medRef = ref(db, 'medicationEventsTest');
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


    return meds;

  } catch (error) {
    console.error('Error fetching medication events:', error.message);
    throw new Error('Failed to fetch medication events.');
  }
};

export default fetchAllMedicines;
