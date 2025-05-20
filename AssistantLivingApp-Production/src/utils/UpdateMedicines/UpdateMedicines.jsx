import { getDatabase, ref, push, update } from 'firebase/database';

/**
 * Adds medicine data under "medicationEventsTest/{id}" in Realtime Database.
 *
 * @param {Object} MedData - The medicine data to add.
 * @param {string} id - The user's or device's unique ID (e.g., Raspberry Pi ID).
 * @param {Function} onSuccess - Callback on success.
 * @param {Function} onError - Callback on failure.
 */
const UpdateMedicines = async ({ id, MedData, onSuccess, onError }) => {
  console.log('Calling UpdateMedicines...');

  try {
    const dbInstance = getDatabase(); 
    const medRef = ref(dbInstance, `medicationEventsTest/${id}`); 

    await update(medRef, MedData);

    console.log('Medicine added successfully with ID:', medRef.key);
    if (onSuccess) onSuccess(medRef.key);
  } catch (error) {
    console.error('Error adding medicine:', error);
    if (onError) onError(error);
  }
};

export default UpdateMedicines;
