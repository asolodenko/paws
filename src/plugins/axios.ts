import axios from 'axios';
import { firebaseApp } from "@/firebase";
import { getAuth } from 'firebase/auth';
// Create a new Axios instance
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(async (config) => {
  const auth = getAuth(firebaseApp);
  const idToken = await auth?.currentUser?.getIdToken();
  if (idToken) {
    config.headers.Authorization = idToken;
  }
  return config;

}, error => {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use((response) => {
  // Do something with response data
  return response;
}, error => {
  // Do something with response error
  return Promise.reject(error);
});

export default instance;