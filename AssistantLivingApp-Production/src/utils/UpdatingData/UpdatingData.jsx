import { doc, setDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../../../firebaseConfig";
import { update } from "firebase/database";

export const UpdatingData = async ({
  Category,
  Bio,
  CaregiverRemarks,
    Email,
  Name,
  RaspberrryPiID,
  EmergencyContact,
  Profile,
  Gender,
  formatDate,
}) => {
  try {
    console.log('entering updating data',Email )
    const collectionName = "Users";
    if (!collectionName) {
      throw new Error("Invalid category provided.");
    }

    // Prepare the user data
    const userData = {
      EmergencyContact,
      Bio,
      Email,
      CaregiverRemarks,
      Profile,
      Name: Name,
      RaspberrryPiID,
      Gender,
      Dob: formatDate,
      Category:'Disabled/Elder User',
    updatedAt: new Date(),
      Visibility: true,
      login: true,
      Login: "true",
      Status: "Active",
    };
    console.log('THE USER DATA IS', userData)

    // Create a document reference for the specific document in the category collection
    const docRef = doc(firestore, collectionName, Email);

    // Save the data to Firestore
    await updateDoc(docRef, userData);

    console.log(
      `User data saved in ${collectionName} collection with ID: ${Email}`
    );
    return { success: true };
  } catch (error) {
    console.error("Error saving user data:", error);
    throw error; // Optionally re-throw the error to handle it in the calling function
  }
};
