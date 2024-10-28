import { addDoc, collection, DocumentData, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { postItemType, taskItemType } from "@/types/fiebaseDocTypes";

export const fetchTasks = async () => {
    const q = query(
        collection(db, "taskManager"),
        where("chk", "==", true),
        orderBy("orderNum", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
        const data = doc.data() as DocumentData
        return({
            id: data.id,
            chk: data.chk,
            color: data.color,
            orderNum: data.orderNum,
            taskName: data.taskName,
        }) as taskItemType
    });
};

export const addItem = async (newTask: postItemType) => {
    await addDoc(collection(db, "task"), newTask)
}