import fetchMPUData from "./FetchMPUData";

/**
 * Fetches all medication events from Realtime Database.
 * @returns {Promise<Array>} - Returns an array of medications.
 */
const fetchMyMPUData = async (ids) => {
  console.log("the id in MPU", ids);
  try {
    const allMeds = await fetchMPUData();

    const myMeds = allMeds?.filter((med) => ids.includes(med?.raspberryPiId));
    console.log("ending");
    if (!myMeds) {
      return [];
    }
    myMeds.sort((a, b) => b.timestamp - a.timestamp);
    console.log("fetched my mpu data", myMeds);
    return myMeds;
  } catch (error) {
    console.error("Error fetching medication events:", error.message);
    throw new Error("Failed to fetch medication events.");
  }
};

export default fetchMyMPUData;
