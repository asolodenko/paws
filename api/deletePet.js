import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  })
}
const db = getFirestore()

export default async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests are allowed' })
    return
  }

  const idToken = req.headers.authorization
  if (!idToken) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  const decodedToken = await getAuth(getApp()).verifyIdToken(idToken)
  const decodedUserId = decodedToken.uid

  const user = await getAuth(getApp()).getUser(decodedUserId)
  if (!user.customClaims || !user.customClaims.admin) {
    res.status(403).send({ message: 'Forbidden: User is not an admin' })
    return
  }

  const { petId } = req.body
  if (!petId) {
    res.status(400).send({ message: 'Invalid request parameters' })
    return
  }

  try {
    const petRef = db.collection('paws').doc(petId)
    const petDoc = await petRef.get()
    
    if (!petDoc.exists) {
      res.status(404).send({ message: 'Pet not found' })
      return
    }

    await petRef.delete()

    res.status(200).send({ 
      success: true,
      message: 'Pet deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting pet:', error)
    res.status(500).send({ message: 'Internal server error' })
  }
}
