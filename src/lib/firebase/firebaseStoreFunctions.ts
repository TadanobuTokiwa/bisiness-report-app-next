import { addDoc, collection, doc, DocumentData, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import { googleProvider, getFirebaseServices } from "../../services/firebaseConfig";
import { listItemType, taskItemType } from "@/types/firebaseDocTypes";
import { signInWithPopup, signOut } from "firebase/auth";
import Cookies from 'js-cookie';

type fetchAllUserItemsPropsType = {
    startDate: string;
    endDate: string;
}

type fetchTaskFilterdItemsPropsType = {
    startDate: string;
    endDate: string;
    userName: string;
    task: string;
}

type fetchAllUserTaskFilterdItemsPropsType = {
    startDate: string;
    endDate: string;
    task: string;
}

export const fetchAllUserItems = async ({startDate, endDate}: fetchAllUserItemsPropsType) => {
    const{ db } = getFirebaseServices()
    const q = query(
        collection(db, "task"),
        where("DateTimeNum", "<=", Number(endDate.replaceAll("-","") + "2359")),
        where("DateTimeNum", ">=", Number(startDate.replaceAll("-","") + "0000")),
        orderBy("DateTimeNum" , "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
        const data = doc.data() as DocumentData
        const docID = doc.id
        return({
            date: data.createDate,
            task: data.task,
            startTime: data.startTime,
            endTime: data.endTime,
            workingHour: data.workingHour,
            kensu: data.kensu,
            perHour: data.perHour,
            userName: data.User,
            docID
        }) as listItemType
    });
}

export const fetchTaskFilterdItems = async ({startDate, endDate, userName, task}: fetchTaskFilterdItemsPropsType) => {
    const{ db } = getFirebaseServices()
    const q = query(
        collection(db, "task"),
        where("User" , "==" , userName),
        where("DateTimeNum", "<=", Number(endDate.replaceAll("-","") + "2359")),
        where("DateTimeNum", ">=", Number(startDate.replaceAll("-","") + "0000")),
        where("task", "==", task),
        orderBy("DateTimeNum" , "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
        const data = doc.data() as DocumentData
        const docID = doc.id
        return({
            date: data.createDate,
            task: data.task,
            startTime: data.startTime,
            endTime: data.endTime,
            workingHour: data.workingHour,
            kensu: data.kensu,
            perHour: data.perHour,
            userName: data.User,
            docID
        }) as listItemType
    });
}

export const fetchAllUserTaskFilterdItems = async ({startDate, endDate, task}: fetchAllUserTaskFilterdItemsPropsType) => {
    const{ db } = getFirebaseServices()
    const q = query(
        collection(db, "task"),
        where("DateTimeNum", "<=", Number(endDate.replaceAll("-","") + "2359")),
        where("DateTimeNum", ">=", Number(startDate.replaceAll("-","") + "0000")),
        where("task", "==", task),
        orderBy("DateTimeNum" , "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
        const data = doc.data() as DocumentData
        const docID = doc.id
        return({
            date: data.createDate,
            task: data.task,
            startTime: data.startTime,
            endTime: data.endTime,
            workingHour: data.workingHour,
            kensu: data.kensu,
            perHour: data.perHour,
            userName: data.User,
            docID
        }) as listItemType
    });
}

export const updateItem = async(editItem: listItemType) => {
    const{ db } = getFirebaseServices()
    const docRef = doc(db, "task", editItem.docID);

    const dateTime1 = new Date('2024-03-01 ' + editItem.startTime + ':00')
    const dateTime2 = new Date('2024-03-01 ' + editItem.endTime + ':00')
    const diff = dateTime2.getTime() - dateTime1.getTime(); 
    const workingHour = Math.floor(Math.pow(10,3) * (diff / (60*60*1000))) / Math.pow(10,3);
    const dateTimeNum = Number(String(editItem.date.replaceAll("-","")) + String(editItem.startTime.replaceAll(":","")))
    const perHour = editItem.kensu === 0 ? 0 : Math.floor(Math.pow(10,2) * (editItem.kensu / (diff / (60*60*1000)))) / Math.pow(10,2);
    
    const newItem = {
        createDate: editItem.date,
        startTime: editItem.startTime,
        endTime: editItem.endTime,
        kensu: editItem.kensu,
        task: editItem.task,
        workingHour,
        perHour,
        dateTimeNum,
    }

    let error: boolean = false
    try { 
        await updateDoc(docRef, newItem);
    } catch {
        error = true
    } finally {
        return {newItem, error};
    }
}

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