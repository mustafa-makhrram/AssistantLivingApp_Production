import { getDatabase, ref, push, set } from 'firebase/database';
import { db } from '../../../firebaseConfig';

/**
 *
 * @param {Object} MedData - The medicine data to add.
 * @param {string} category - The user's category (not used here but kept for compatibility).
 * @param {string} email - The user's email (not used here but kept for compatibility).
 * @param {Function} onSuccess - Callback for successful addition.
 * @param {Function} onError - Callback for handling errors.
 */
const AddMedicines = async ({ MedData, onSuccess, onError }) => {
  console.log('Calling AddMedicines...');

  try {
    const dbInstance = getDatabase();
    const medRef = ref(dbInstance, 'medicationEventsTest');

    const newMedRef = push(medRef)
    await set(newMedRef, MedData);

    console.log('Medicine added successfully with ID:', newMedRef.key);
    if (onSuccess) onSuccess(newMedRef.key);
  } catch (error) {
    console.error('Error adding medicine:', error);
    if (onError) onError(error);
  }
};

export default AddMedicines;
