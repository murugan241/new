import { signInWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
import { auth, db } from "./firebase"; 



export const monitorAuthState = () => {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const userDocRef = doc(db, "Users", user.uid); // Adjust collection name if needed
            const userDoc = await getDoc(userDocRef);
  
            if (userDoc.exists()) {
              resolve({ ...user, userDocData: userDoc.data() });
            } else {
              reject(new Error("User document does not exist in Firestore"));
            }
          } catch (error) {
            reject(error);
          }
        } else {
          reject(new Error("No user is logged in"));
        }
      });
    });
  };

export const loginWithEmailPassword = async (email, password) => {
  try {
    // Sign in the user
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch Firestore document using the user's UID
    const userDocRef = doc(db, "Users", user.uid); // Adjust collection name if needed
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return { ...user, userDocData: userDoc.data() };
    } else {
      throw new Error("User document does not exist in Firestore"); // here also want to return the error
    }
  } catch (error) {
    return { error: error.message }; // Return an error message
  }
};

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    // Perform Google sign-in
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const email = user.email;

    // Query Firestore to check if email exists in the Users collection
    const usersCollectionRef = collection(db, "Users");
    const usersQuery = query(usersCollectionRef, where("email", "==", email));
    const querySnapshot = await getDocs(usersQuery);

    if (!querySnapshot.empty) {
      console.log("User is authorized:", querySnapshot.docs[0].data());
      return { ...user, userDocData: querySnapshot.docs[0].data() }; // Or additional data if needed
    } else {
      // User not authorized, sign out and delete user
      console.warn("Unauthorized user. Logging out and removing user from Firebase.");

      // Sign out the user
      await signOut(auth);

      // Delete the user from Firebase Authentication
      await user.delete();

      throw new Error("You are not authorized to access this site.");
    }
  } catch (error) {
    console.error("Error during Google Sign-In:", error.message);
    return { error: error.message };
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    return {"msg":"User signed out successfully"};
  } catch (error) {
    return {"Error signing out": error.message};
  }
};

// loginWithEmailPassword("buvanesifet26@gmail.com","Admin123");  --> example for login with email and password

