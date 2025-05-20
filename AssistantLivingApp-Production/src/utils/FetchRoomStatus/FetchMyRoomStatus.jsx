
import { LocalUserData } from '../LocalUserData/LocalUserData';
import fetchAllRoomStatus from './FetchRoomStatus';

/**
 * Fetches all medication events from Realtime Database.
 * @returns {Promise<Array>} - Returns an array of medications.
 */
const fetchMyRoomStatus = async (ids) => {
  console.log('the id is ',ids)
  try {
    const allMeds = await fetchAllRoomStatus()

  const myMeds = allMeds?.filter((med) =>
  ids.includes(med?.raspberryPiId))
    console.log('ending ')
    if (!myMeds) {
      return []; 
    }
    myMeds.sort((a, b) => b.timestamp - a.timestamp);

    return myMeds;
  } catch (error) {
    console.error('Error fetching medication events:', error.message);
    throw new Error('Failed to fetch medication events.');
  }
};

export default fetchMyRoomStatus;
