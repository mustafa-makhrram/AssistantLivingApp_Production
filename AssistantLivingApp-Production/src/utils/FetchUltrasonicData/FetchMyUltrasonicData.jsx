import fetchUltrasonicData from "./FetchUltrasonicData";

/**
 * Fetches all ultrasonic sensor events and returns only those
 * whose Raspberry Pi ID is in the provided list of IDs.
 *
 * @param {string[]} Rasids - Array of Raspberry Pi ID strings
 * @returns {Promise<Object[]>} – Filtered, time-sorted list
 */
const fetchMyUltrasonicData = async (Rasids) => {
  console.log("🔍 Input IDs:", Rasids);

  // Normalize and trim your ids for reliable matching
  const cleanedIds = Array.isArray(Rasids)
    ? Rasids.map((id) =>
        typeof id === "string" ? id.trim() : String(id).trim()
      ).filter((id) => id.length > 0)
    : [];
  console.log("🧼 Cleaned IDs:", cleanedIds);

  if (cleanedIds.length === 0) {
    console.warn("⚠️ No valid IDs provided – returning empty array");
    return [];
  }

  try {
    const allMeds = await fetchUltrasonicData();

    if (!Array.isArray(allMeds)) {
      console.warn("⚠️ fetchUltrasonicData did not return an array.");
      return [];
    }

    const myMeds = allMeds.filter((med) => {
      const medId =
        typeof med?.raspberryPiId === "string"
          ? med.raspberryPiId.trim()
          : String(med?.raspberryPiId ?? "").trim();

      if (!medId) return false;

      const doesMatch = cleanedIds.includes(medId);
      console.log(`🔎 Checking medId="${medId}" → ${doesMatch}`);
      return doesMatch;
    });

    console.log(`✅ Found ${myMeds.length} matching records.`);

    myMeds.sort((a, b) => b.timestamp - a.timestamp);

    return myMeds;
  } catch (error) {
    console.error("❌ Error fetching ultrasonic data:", error.message);
    throw new Error("Failed to fetch ultrasonic data.");
  }
};

export default fetchMyUltrasonicData;
