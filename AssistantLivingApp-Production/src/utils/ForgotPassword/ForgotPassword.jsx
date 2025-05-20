import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebaseConfig";

const forgotPassword = async (email) => {
  if (!email) {
    console.error("Email is required");
    return { success: false, message: "Please provide an email" };
  }

  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: "Password reset email sent. Check your inbox.",
    };
  } catch (error) {
    console.error("Error sending password reset email:", error.message);
    return { success: false, message: error.message };
  }
};

export default forgotPassword;
