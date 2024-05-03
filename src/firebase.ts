// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signOut, User, signInWithRedirect, getRedirectResult, signInWithPopup } from 'firebase/auth';
import { useUserStore } from "./store/user";
import router from "./router";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyD0JlkHY2yzZgnXRYhRh74zO-RdY_nggsM",
  authDomain: "the-paws-cef04.firebaseapp.com",
  projectId: "the-paws-cef04",
  storageBucket: "the-paws-cef04.appspot.com",
  messagingSenderId: "312247159937",
  appId: "1:312247159937:web:ba679ab21a8c120df15180",
  measurementId: "G-GPY8SBV1M9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const { setCurrentUser, resetCurrentUser } = useUserStore();

export const handleSignIn = () => {
  signInWithPopup(auth, provider)
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
