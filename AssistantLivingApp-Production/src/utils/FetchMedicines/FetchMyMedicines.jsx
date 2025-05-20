import { get, ref } from 'firebase/database';
import { db } from '../../../firebaseConfig';
import fetchAllMedicines from './FetchAllMedicines';

/**
 * Format current date to yyyy-MM-dd (e.g., 2025-04-24)
 */
const getTodayDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
};

/**
 * Converts "HH:mm" string to minutes since midnight
 */
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

/**
 * Get current time in minutes since midnight
 */
const getCurrentTimeInMinutes = () => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

/**
 * Fetches today's medication events for the given Raspberry Pi ID,
 * and sorts them based on closeness to current time.
 * 
 * @param {string} id - Raspberry Pi ID
 * @returns {Promise<Array>} - Filtered and sorted array of medications
 */
const fetchMyMedicines = async (ids) => {
  console.log('Fetching medicines for IDs:', ids);

  try {
    const today = getTodayDate();
    console.log('Todays date:', today);
    const currentTimeMinutes = getCurrentTimeInMinutes();
    const allMeds = await fetchAllMedicines();

    const myMeds = allMeds.filter((med) =>
    ids.includes(med?.raspberryPiId) 
      &&
      med?.Medication_Date === today
    );


    console.log('Filtered medications:', myMeds);

    const sortedMeds = myMeds.sort((a, b) => {
      const aTimeDiff = Math.abs(timeToMinutes(a.scheduledTime) - currentTimeMinutes);
      const bTimeDiff = Math.abs(timeToMinutes(b.scheduledTime) - currentTimeMinutes);
      return aTimeDiff - bTimeDiff;
    });

    return sortedMeds;
  } catch (error) {
    console.error('Error fetching my medication events:', error.message);
    throw new Error('Failed to fetch medication events.');
  }
};


export default fetchMyMedicines;
