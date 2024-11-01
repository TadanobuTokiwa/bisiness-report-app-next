import { auth } from "../../services/firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

export const signUp = async (email: string, password: string) => {
    if(auth){
        return await createUserWithEmailAndPassword(auth, email, password);
    }
};

export const logIn = async (email: string, password: string) => {
    if(auth){        
        return await signInWithEmailAndPassword(auth, email, password);
    }
};

export const logOut = async () => {
    if(auth){
        return await signOut(auth);
    }
};