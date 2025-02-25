import { firebaseApp, firestore } from "@/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signOut, User, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { useUserStore } from "@/store/user";
import router from "@/router";

const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

export const handleSignIn = () => {
  // signInWithRedirect(auth, provider)
  signInWithPopup(auth, provider) //CORS error in console, but still login 
    .then(() => {
      router.go(-1); // push ? to prev route
    }).catch((error) => {
      console.log('Sign-in error:', error);
    });
}

export const handleSignOut = () => {
  signOut(auth)
    .then(() => {})
    .catch((error) => {
      // An error happened.
      console.log('Sign-out error:', error);
    });
};

const handleUserData = async (user: User) => {
  const {
    uid,
    displayName,
    email,
    emailVerified,
    phoneNumber,
    photoURL
  } = user;
  const userRef = doc(firestore, 'users', uid);

  try {
    const docSnapshot = await getDoc(userRef);
    const dateTimeNow = new Date().toISOString();
    const updUser = {
      uid,
      displayName,
      email,
      emailVerified,
      phoneNumber,
      photoURL,
      lastLogin: dateTimeNow
    }

    if (docSnapshot.exists()) {
      await updateDoc(userRef, {
        lastLogin: dateTimeNow,
      });
    } else {
      const newUser = {
        ...updUser,
        firstLogin: dateTimeNow
      };
      await setDoc(userRef, newUser);
    }

    return updUser;
  } catch (error) {
    console.error("Error adding or updating user:", error);
    throw new Error("Failed to handle user data.");
  }
}

export const monitorAuthStore = () => {
  const { setCurrentUser, resetCurrentUser, setIsAdmin, setLoading } = useUserStore();

  onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      const userData = await handleUserData(user);
      setCurrentUser(userData);

      // User is signed in, retrieve custom claims
      user.getIdTokenResult()
        .then((idTokenResult) => {
          // Get custom claims from the ID token result
          const customClaims = idTokenResult.claims;
          
          // Access custom claims (e.g., admin)
          if (setIsAdmin) setIsAdmin(customClaims.admin === true)
        })
        .catch((error) => {
          console.error('Error getting custom claims:', error);
        });
    } else {
      resetCurrentUser();
    }

    setLoading(false);
  })
};