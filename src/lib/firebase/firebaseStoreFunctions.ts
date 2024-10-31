import { addDoc, collection, doc, DocumentData, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import { db, googleProvider, auth } from "../../services/firebaseConfig";
import { listItemType, postItemType, taskItemType } from "@/types/firebaseDocTypes";
import { signInWithPopup, signOut } from "firebase/auth";
import Cookies from 'js-cookie';

type fetchItemsPropsType = {
    startDate: string;
    endDate: string;
    userName: string;
}

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

export const fetchTasks = async (): Promise<taskItemType[]> => {
    const q = query(
        collection(db, "taskManager"),
        where("chk", "==", true),
        orderBy("orderNum", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
        const data = doc.data() as DocumentData
        const docID = doc.id
        return({
            id: data.id,
            chk: data.chk,
            color: data.color,
            orderNum: data.orderNum,
            taskName: data.taskName,
            docID
        }) as taskItemType
    });
};

export const addItem = async (newTask: postItemType) => {
    await addDoc(collection(db, "task"), newTask)
}

export const fetchItems = async ({startDate, endDate, userName}: fetchItemsPropsType) => {
    const q = query(
        collection(db, "task"),
        where("User" , "==" , userName),
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

export const fetchAllUserItems = async ({startDate, endDate}: fetchAllUserItemsPropsType) => {
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

export const updateItem = async(editItem: listItemType) => {
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
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        return user;
    } catch (error) {
        console.error("Error signing in with Google", error);
    }
}

export const fetchLoginPaths = async () => {
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
    try {
        await signOut(auth);
        Cookies.remove('__session');
    } catch (error) {
        console.error("Error signing out:", error);
    }
};

export const addTaskManager = async (newTask: taskItemType) => {
    const newTaskManagerItem = {
        chk: newTask.chk,
        color: newTask.color,
        id: newTask.id,
        orderNum: newTask.orderNum,
        taskName: newTask.taskName,
    }
    await addDoc(collection(db, "taskManager"), newTaskManagerItem)
}

export const updateTaskManager = async(editItem: taskItemType) => {
    const docRef = doc(db, "taskManager", editItem.docID);
    const editTaskManagerItem = {
        chk: editItem.chk,
        color: editItem.color,
        id: editItem.id,
        orderNum: editItem.orderNum,
        taskName: editItem.taskName,
    }

    let error: boolean = false
    try { 
        await updateDoc(docRef, editTaskManagerItem);
    } catch {
        error = true
    } finally {
        return {editTaskManagerItem, error};
    }
}

export const fetchAllTasks = async (): Promise<taskItemType[]> => {
    const q = query(
        collection(db, "taskManager"),
        orderBy("orderNum", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
        const data = doc.data() as DocumentData
        const docID = doc.id
        return({
            id: data.id,
            chk: data.chk,
            color: data.color,
            orderNum: data.orderNum,
            taskName: data.taskName,
            docID
        }) as taskItemType
    });
};