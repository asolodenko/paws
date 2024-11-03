// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
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
const { setCurrentUser, resetCurrentUser, setIsAdmin } = useUserStore();

export const handleSignIn = () => {
  // signInWithRedirect(auth, provider)
  signInWithPopup(auth, provider) //CORS error in console, but still login 
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    // The signed-in user info.
    const user = result.user;
    setCurrentUser(user);
    router.push('/'); // to prev route
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
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

onAuthStateChanged(auth, (user) => {
  if (user) {
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
    // User is signed out
    console.log('User is signed out');
  }
});