// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signOut, User, signInWithRedirect, getRedirectResult, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { useUserStore } from "@/store/user";
import router from "@/router";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const handleSignIn = () => {
  // signInWithRedirect(auth, provider)
  signInWithPopup(auth, provider) //CORS error in console, but still login 
    .then((result) => {
      router.push('/'); // to prev route
    }).catch((error) => {
      console.log('Sign-in error:', error);
    });
}

export const handleSignOut = () => {
  signOut(auth).then(() => {
    // Sign-out successful.
    resetCurrentUser();
    console.log('Sign out');
  }).catch((error) => {
    // An error happened.
    console.log('Sign-out error:', error);
  });
};

const handleUserData = (user: User) => {
  const {
    uid,
    displayName,
    email,
    emailVerified,
    phoneNumber,
    photoURL
  } = user;
  const userRef = doc(firestore, 'users', uid);

  getDoc(userRef).then((docSnapshot) => {
    if (docSnapshot.exists()) {
      updateDoc(userRef, {
        lastLogin: serverTimestamp(),
      });
    } else {
      setDoc(userRef, {
        uid,
        displayName,
        email,
        emailVerified,
        phoneNumber,
        photoURL,
        firstLogin: serverTimestamp(),
        lastLogin: serverTimestamp()
      });
    }
  }).catch((error) => {
    console.error("Error adding or updating user:", error);
  });
}

onAuthStateChanged(auth, (user) => {
  const { setCurrentUser, resetCurrentUser, setIsAdmin, setLoading } = useUserStore();

  if (user) {
    const {
      uid,
      displayName,
      email,
      emailVerified,
      phoneNumber,
      photoURL
    } = user;
    setCurrentUser(user);
    handleUserData(user);
    

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
    // User is signed out
    console.log('User is signed out');
  }

  setLoading(false);
});