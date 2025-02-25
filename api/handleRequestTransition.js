import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

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
    res.status(405).send({ message: 'Only POST requests are allowed' });
    return;
  }

  const idToken = req.headers.authorization;
  if (!idToken) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const decodedToken = await getAuth(getApp()).verifyIdToken(idToken);
  const decodedUserId = decodedToken.uid;

  const user = await getAuth(getApp()).getUser(decodedUserId);
  if (!user.customClaims || !user.customClaims.admin) {
    res.status(403).send({ message: 'Forbidden: User is not an admin' });
    return;
  }

  const { requestId, action, comment } = req.body; // include comment 
  if (!requestId || !action) {
    res.status(400).send({ message: 'Invalid request parameters' });
    return;
  }

  const requestRef = db.collection('requests').doc(requestId);
  const request = await requestRef.get();
  if (!request.exists) {
    res.status(404).send({ message: 'Request not found' });
    return;
  }

  const updateData = {
    adminId: req.user ? req.user.uid : null,
    respondedAt: new Date().toISOString()
  };

  switch (action) {
    case 'approve':
      updateData.status = 'approved';
      break;
    case 'reject':
      updateData.status = 'rejected';
      updateData.comment = comment || '';
      break;
    case 'fulfill':
      updateData.status = 'fulfilled';
      break;
    case 'unfulfill':
      updateData.status = 'unfulfilled';
      break;
    default:
      res.status(400).send({ message: 'Invalid action' });
      return;
  }

  await requestRef.update(updateData);

  res.status(200).send({ success: true });
};
