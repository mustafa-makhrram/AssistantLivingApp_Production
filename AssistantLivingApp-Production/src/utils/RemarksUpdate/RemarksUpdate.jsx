import { doc, updateDoc, setDoc } from "firebase/firestore";
import { firestore } from "../../../firebaseConfig";

export const RemarksUpdate = async ( id, Remarks ) => {
  try {
    console.log("Updating Data for ID:", id);

    const collectionName = "Users";
    if (!collectionName) {
      throw new Error("Invalid category provided.");
    }

    const docRef = doc(firestore, collectionName, id);

    await updateDoc(docRef, {
      CaregiverRemarks: Remarks,
    });

    console.log(
      `Document with ID ${id} in collection ${collectionName} updated successfully.`
    );

    return { success: true };
  } catch (error) {
    console.error("Error updating user data or token:", error);
    throw error;
  }
};
