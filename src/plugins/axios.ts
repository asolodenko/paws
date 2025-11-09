import axios from 'axios'
import { firebaseApp } from '@/firebase'
import { getAuth } from 'firebase/auth'
import { useSnackbarStore } from '@/store/useSnackbarStore'

// Create a new Axios instance
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000, // 30 seconds - increased for serverless cold starts
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use(async (config) => {
  const auth = getAuth(firebaseApp)
  const idToken = await auth?.currentUser?.getIdToken()
  if (idToken) {
    config.headers.Authorization = idToken
  }
  return config

}, error => {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
instance.interceptors.response.use((response) => {
  // Do something with response data
  return response
}, error => {
  const snackbar = useSnackbarStore() // Get snackbar store
  snackbar.triggerSnackbar(`Request failed: ${error.message}`, 'error')
  // Do something with response error
  return Promise.reject(error)
})

export const sendPOST = async (api: string, body: object) => {
  const snackbar = useSnackbarStore() // Get snackbar store
  try {
    const response = await instance.post(`/${api}`, body)

    if (response.status !== 200) {
      throw new Error(`Error: ${response.statusText}`)
    }

    snackbar.triggerSnackbar('Request successful!', 'success')
    return response.data
  } catch (error) {
    snackbar.triggerSnackbar('Error sending request', 'error')
    console.error('Error sending request:', error)
  }
}

export default instance