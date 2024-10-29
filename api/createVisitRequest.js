// const admin = require('firebase-admin');
// admin.initializeApp();

// module.exports = async (req, res) => {
//   if (req.method !== 'POST') {
//     res.status(405).send({ message: 'Only POST requests are allowed' });
//     return;
//   }

//   const { userId, requestId } = req.body;

//   if (!userId || !requestId) {
//     res.status(400).json({ error: 'Missing userId or requestId' });
//     return;
//   }

//   const db = admin.firestore();
//   await db.collection('visitRequests').doc(requestId).update({
//     adminId: req.user.uid,
//     timestamp: admin.firestore.FieldValue.serverTimestamp()
//   });

//   res.status(200).send({ success: true });
// };
import admin from 'firebase-admin';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: //cert(serviceAccount)
    cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') // Replacing the escaped \n characters
    })
  });
}
const db = getFirestore();

export default async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { userId, pawId } = req.body;

  if (!userId) {
    res.status(400).json({ error: 'Missing userId or requestId' });
    return;
  }

  try {
    const newRequest = {
      userId,
      pawId,
      status: 'pending', // Example field
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('adoptionRequests').add(newRequest);

    res.setHeader('Access-Control-Allow-Origin', '*').status(200).json({ message: 'Request received successfully', id: docRef.id });
  } catch (error) {
    console.error('Error adding document: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};