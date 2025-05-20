import { get, ref } from 'firebase/database';
import { db } from '../../../firebaseConfig';
import fetchAllMedicines from '../FetchMedicines/FetchAllMedicines';

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
 * @param {string} ids - Raspberry Pi ID Array
 * @returns {Promise<Array>} - Filtered and sorted array of medications
 */
const fetchFutureMedicines = async (ids) => {
    try {
      const today = getTodayDate();
      const currentTimeMinutes = getCurrentTimeInMinutes();
      const allMeds = await fetchAllMedicines();
  
      const myMeds = allMeds.filter((med) => {
        if (!ids.includes(med?.raspberryPiId)  || !med?.Medication_Date || !med?.scheduledTime) return false;
      
        const medDate = new Date(med.Medication_Date);
        const todayDate = new Date();
        const medTime = timeToMinutes(med.scheduledTime);
      
        // If med is scheduled after today OR it's today and time is in the future
        return (
          medDate > todayDate ||
          (medDate.toDateString() === todayDate.toDateString() && medTime > currentTimeMinutes)
        );
      });
      
  
      // Sort by time closeness (optional but useful)
      const now = new Date();
      const currentMinutes = getCurrentTimeInMinutes();
      
      const sortedMeds = myMeds.sort((a, b) => {
        const aDate = new Date(a.Medication_Date);
        const bDate = new Date(b.Medication_Date);
      
        if (aDate.getTime() !== bDate.getTime()) {
          return aDate - bDate; // Sort by date first
        }
      
        // Same date: sort by closeness to current time
        const aTimeDiff = Math.abs(timeToMinutes(a.scheduledTime) - currentMinutes);
        const bTimeDiff = Math.abs(timeToMinutes(b.scheduledTime) - currentMinutes);
        return aTimeDiff - bTimeDiff;
      });
      
      return sortedMeds;
    } catch (error) {
      console.error('Error fetching medication events:', error.message);
      throw new Error('Failed to fetch medication events.');
    }
  };

export default fetchFutureMedicines;
