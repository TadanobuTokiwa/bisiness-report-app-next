import { collection, DocumentData, getDocs, query } from "firebase/firestore";
import { googleProvider, getFirebaseServices } from "../../services/firebaseConfig";
import { signInWithPopup, signOut } from "firebase/auth";
import Cookies from 'js-cookie';

export const signInWithGoogle = async () => {
    const{ auth } = getFirebaseServices()
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        return user;
    } catch (error) {
        console.error("Error signing in with Google", error);
    }
}

export const fetchLoginPaths = async () => {
    const{ db } = getFirebaseServices()
    const q = query(
        collection(db, "loginAccount")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
        const data = doc.data() as DocumentData
        return({
            id: data.id,
            accountname: data.accountname
        })
    });
}

export const logout = async () => {
    const{ auth } = getFirebaseServices()
    try {
        await signOut(auth);
        Cookies.remove('__session');
    } catch (error) {
        console.error("Error signing out:", error);
    }
};