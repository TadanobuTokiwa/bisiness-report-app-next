import functions from 'firebase-functions';
import admin from 'firebase-admin';
import { fetchTasks } from '@/lib/firebase/firebaseStoreFunctions';

admin.initializeApp();

export const getFirestoreData = functions.https.onRequest(async (req, res) => {
    try {
        const data = await fetchTasks()

        res.set('Cache-Control', 'public, max-age=43200, s-maxage=86400');
        res.json(data);
    } catch {
        res.status(500);
    }
});