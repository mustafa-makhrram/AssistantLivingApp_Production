import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
export const SignUpWithEmailPassword = async (email, password) => {
  try {
    // Create a user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send email verification
    await sendEmailVerification(user);
    console.log("Email verification sent to:", email);

    return user; // Return the created user
  } catch (error) {
    let errorMessage = "Authentication failed";

    // Handle Firebase Auth Errors
    switch (error.code) {
      case "auth/email-already-in-use":
        errorMessage = "This email is already in use.";
        break;
      case "auth/invalid-email":
        errorMessage = "Invalid email format.";
        break;
      case "auth/weak-password":
        errorMessage = "Password should be at least 6 characters.";
        break;
      default:
        errorMessage = error.message;
    }

    throw new Error(errorMessage); 
  }
};
