import { ref, update } from "firebase/database"; 
import { db } from "../../../firebaseConfig"; 


export const UpdateMedicineStatus = async ({ id, Med }) => {
  try {
    const collectionPath = `medicationEventsTest/${id}`;

    await update(ref(db, collectionPath), Med); 

    console.log(`Document with ID ${id} updated successfully in Realtime DB.`);

    return { success: true };
  } catch (error) {
    console.error("Error updating medication status:", error);
    throw error;
  }
};
