import functions from 'firebase-functions';
import admin from 'firebase-admin';

admin.initializeApp();

export const getFirestoreData = functions.https.onRequest(async (req, res) => {
    try {
        const snapshot = await admin.firestore().collection('your_collection').get();
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
        res.set('Cache-Control', 'public, max-age=43200, s-maxage=86400');
        res.json(data);
    } catch {
        res.status(500);
    }
});