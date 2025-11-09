import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

// Initialize Firebase Admin SDK if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: //cert(serviceAccount)
    cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Replacing the escaped \n characters
    }),
  })
}
const db = getFirestore()

export default async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  const idToken = req.headers.authorization
  if (!idToken) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  const decodedToken = await getAuth(getApp()).verifyIdToken(idToken)
  const decodedUserId = decodedToken.uid

  const userDocRef = db.doc(`users/${decodedUserId}`)
  const userDocSnap = await userDocRef.get()

  if (!userDocSnap.exists) {
    res.status(403).json({ error: 'Forbidden: User not found' })
    return
  }

  const { userId, pawId } = req.body
  if (!userId || !pawId) {
    res.status(400).json({ error: 'Missing userId or pawId' })
    return
  }

  try {
    const requestsSnapshot = await db.collection('requests')
      .where('userId', '==', userId)
      .where('pawId', '==', pawId)
      .where('type', '==', 'visit')
      .where('status', '==', 'fulfilled')
      .get()

    const fulfilledVisitCount = requestsSnapshot.size

    res.setHeader('Access-Control-Allow-Origin', '*').status(200).json({ 
      visitCount: fulfilledVisitCount,
      isEligibleForAdoption: fulfilledVisitCount >= 5,
    })
  } catch (error) {
    console.error('Error fetching visit count: ', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
