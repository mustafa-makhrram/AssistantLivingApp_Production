import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../../../firebaseConfig";

export const RegisteringUserData = async ({
  Category,
  Bio,
  CaregiverRemarks,
  Name,
  Email,
  Password,
  RaspberrryPiID,
  EmergencyContact,
  Profile,
  Gender,
  formatDate,
}) => {
  try {
    const collectionName = "Users";
    if (!collectionName) {
      throw new Error("Invalid category provided.");
    }

    // Prepare the user data
    const userData = {
      Email,
      EmergencyContact,
      Bio,
      CaregiverRemarks,
      Profile,
      Name: Name,
      RaspberrryPiID,
      Gender,
      Dob: formatDate,
      Category,
      createdAt: new Date(),
      Visibility: false,
      login: false,
      Login: "false",
      Status: "Active",
    };

    // Create a document reference for the specific document in the category collection
    const docRef = doc(firestore, collectionName, Email);

    // Save the data to Firestore
    await setDoc(docRef, userData);

    console.log(
      `User data saved in ${collectionName} collection with ID: ${Email}`
    );
    return { success: true };
  } catch (error) {
    console.error("Error saving user data:", error);
    throw error; 
  }
};
