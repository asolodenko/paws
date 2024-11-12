import { firebaseApp, firestore } from "@/firebase";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signOut, User, signInWithRedirect, getRedirectResult, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { useUserStore } from "@/store/user";
import router from "@/router";

const auth = getAuth(firebaseApp);
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
  signOut(auth)
    .then(() => {})
    .catch((error) => {
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

export const monitorAuthStore = () => {
  const { setCurrentUser, resetCurrentUser, setIsAdmin, setLoading } = useUserStore();

  onAuthStateChanged(auth, (user: User | null) => {
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
    }

    setLoading(false);
  })
};