import { collection, getDocs } from "firebase/firestore";
import { firestore } from '../../../firebaseConfig';

export const GetData = async (id) => {
  console.log('Getting user data...');

  try {
    const querySnapshot = await getDocs(collection(firestore, 'Users'));
    let matchedData = null;

    querySnapshot.forEach((doc) => {
      if (doc.id === id) {
        matchedData = { ...doc.data(), id: doc.id };
      }
    });

    if (!matchedData) {
      throw new Error("No matching document found in the 'Users' collection.");
    }

    return matchedData;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    throw error;
  }
};
