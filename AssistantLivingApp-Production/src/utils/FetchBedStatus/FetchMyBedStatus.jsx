
import { LocalUserData } from '../LocalUserData/LocalUserData';
import fetchAllBedStatus from './FetchBedStatus';

/**
 * Fetches all medication events from Realtime Database.
 * @returns {Promise<Array>} - Returns an array of medications.
 */
const fetchMyBedStatus = async (ids) => {
  try {
    const allMeds = await fetchAllBedStatus()

    const myMeds = allMeds.filter((med) => ids.includes(med?.raspberryPiId) )

    // console.log('my meds in med fetch:', myMeds)
    if (!myMeds) {
      return []; // No data found
    }
  
   

    myMeds.sort((a, b) => b.timestamp - a.timestamp);

    return myMeds;
  } catch (error) {
    console.error('Error fetching my bed events:', error.message);
    throw new Error('Failed to fetch medication events.');
  }
};

export default fetchMyBedStatus;
