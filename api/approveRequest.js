const admin = require('firebase-admin');
admin.initializeApp();

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests are allowed' });
    return;
  }

  const { requestId, action } = req.body;
  if (!requestId || !['approve', 'reject'].includes(action)) {
    res.status(400).send({ message: 'Invalid request parameters' });
    return;
  }

  const db = admin.firestore();
  await db.collection('requests').doc(requestId).update({
    status: action === 'approve' ? 'approved' : 'rejected',
    adminId: req.user.uid,
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });

  res.status(200).send({ success: true });
};
