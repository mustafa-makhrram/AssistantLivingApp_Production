
import fetchAllUsers from '../FetchAllUsers/FetchAllUsers';

/**
 * @returns {Promise<Array>} 
 */
const fetchCaregiverData = async () => {
  try {
    const alldata = await fetchAllUsers()
const CaregiverData = alldata.filter((item) => item.Category === 'Caregiver')
   console.log('caregiver data', CaregiverData)

    return CaregiverData;
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    throw new Error('Failed to fetch posts.');
  }
};

export default fetchCaregiverData;
