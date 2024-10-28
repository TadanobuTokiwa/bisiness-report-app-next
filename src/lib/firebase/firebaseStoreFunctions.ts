import { addDoc, collection, DocumentData, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import { listItemType, postItemType, taskItemType } from "@/types/firebaseDocTypes";

type fetchItemsProps = {
    startDate: string;
    endDate: string;
    userName: string;
    task: string
}

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

export const fetchItems = async ({startDate, endDate, userName}: fetchItemsProps) => {
    const q = query(
        collection(db, "task"),
        where("User" , "==" , userName),
        where("DateTimeNum", "<=", Number(endDate.replaceAll("-","") + "0000")),
        where("DateTimeNum", ">=", Number(startDate.replaceAll("-","") + "0000")),
        orderBy("DateTimeNum" , "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
        const data = doc.data() as DocumentData
        return({
            date: data.createDate,
            task: data.task,
            startTime: data.startTime,
            endTime: data.endTime,
            workingHour: data.workingHour,
            kensu: data.kensu,
            perHour: data.perHour,
            userName: data.user,
        }) as listItemType
    });
}