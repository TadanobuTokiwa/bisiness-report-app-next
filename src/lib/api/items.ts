import { listItemType, postItemType } from "@/types/firebaseDocTypes";

type fetchItemsPropsType = {
    startDate: string;
    endDate: string;
    userEmail: string;
}

type fetchAllUserItemsPropsType = {
    startDate: string;
    endDate: string;
}

type fetchTaskFilterdItemsPropsType = {
    startDate: string;
    endDate: string;
    userEmail: string;
    task: string;
}

type fetchAllUserTaskFilterdItemsPropsType = {
    startDate: string;
    endDate: string;
    task: string;
}

const token = process.env.NEXT_PUBLIC_API_TOKEN;
const table_name = "firebase_tasks"

export const addItem = async(newTask: postItemType) => {
    const url = "https://logiapp.rextlab.com/api/insert-data"

    const payload = {
        table_name,
        data: [
            newTask
        ],
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error("Error occurred while adding item:", error);
        throw error;
    }
}

export const fetchItems = async ({startDate, endDate, userEmail}: fetchItemsPropsType) => {
    const url = "https://logiapp.rextlab.com/api/fetch-data"

    const payload = {
        table_name,
        "conditions": [
            {
                "column": "User",
                "operator": "=",
                "value": userEmail
            },
            {
                "column": "DateTimeNum",
                "operator": "<=",
                "value": `${endDate.replaceAll("-", "")}2359`
            },
            {
                "column": "DateTimeNum",
                "operator": ">=",
                "value": `${startDate.replaceAll("-", "")}0000`
            },
        ],
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        const fetchData: listItemType[] = responseData.data
        const sortData = fetchData.sort((a: listItemType, b: listItemType) => Number(a.DateTimeNum) - Number(b.DateTimeNum));
        return sortData;
    } catch (error) {
        console.error("Error occurred while adding item:", error);
        throw error;
    }
}

export const fetchAllUserItems = async ({startDate, endDate}: fetchAllUserItemsPropsType) => {
    const url = "https://logiapp.rextlab.com/api/fetch-data"

    const payload = {
        table_name,
        "conditions": [
            {
                "column": "DateTimeNum",
                "operator": "<=",
                "value": `${endDate.replaceAll("-", "")}2359`
            },
            {
                "column": "DateTimeNum",
                "operator": ">=",
                "value": `${startDate.replaceAll("-", "")}0000`
            },
        ],
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        const fetchData: listItemType[] = responseData.data
        const sortData = fetchData.sort((a: listItemType, b: listItemType) => Number(a.DateTimeNum) - Number(b.DateTimeNum));
        return sortData;
    } catch (error) {
        console.error("Error occurred while adding item:", error);
        throw error;
    }
}

export const fetchTaskFilterdItems = async ({startDate, endDate, userEmail, task}: fetchTaskFilterdItemsPropsType) => {
    const url = "https://logiapp.rextlab.com/api/fetch-data"

    const payload = {
        table_name,
        "conditions": [
            {
                "column": "User",
                "operator": "=",
                "value": userEmail
            },
            {
                "column": "DateTimeNum",
                "operator": "<=",
                "value": `${endDate.replaceAll("-", "")}2359`
            },
            {
                "column": "DateTimeNum",
                "operator": ">=",
                "value": `${startDate.replaceAll("-", "")}0000`
            },
            {
                "column": "task",
                "operator": "=",
                "value": task
            },
        ],
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        const fetchData: listItemType[] = responseData.data
        const sortData = fetchData.sort((a: listItemType, b: listItemType) => Number(a.DateTimeNum) - Number(b.DateTimeNum));
        return sortData;
    } catch (error) {
        console.error("Error occurred while adding item:", error);
        throw error;
    }
}

export const fetchAllUserTaskFilterdItems = async ({startDate, endDate, task}: fetchAllUserTaskFilterdItemsPropsType) => {
    const url = "https://logiapp.rextlab.com/api/fetch-data"

    const payload = {
        table_name,
        "conditions": [
            {
                "column": "DateTimeNum",
                "operator": "<=",
                "value": `${endDate.replaceAll("-", "")}2359`
            },
            {
                "column": "DateTimeNum",
                "operator": ">=",
                "value": `${startDate.replaceAll("-", "")}0000`
            },
            {
                "column": "task",
                "operator": "=",
                "value": task
            },
        ],
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        const fetchData: listItemType[] = responseData.data
        const sortData = fetchData.sort((a: listItemType, b: listItemType) => Number(a.DateTimeNum) - Number(b.DateTimeNum));
        return sortData;
    } catch (error) {
        console.error("Error occurred while adding item:", error);
        throw error;
    }
}

export const updateItem = async(editItem: listItemType) => {
    const url = "https://logiapp.rextlab.com/api/update-data"

    const dateTime1 = new Date('2024-03-01 ' + editItem.startTime + ':00')
    const dateTime2 = new Date('2024-03-01 ' + editItem.endTime + ':00')
    const diff = dateTime2.getTime() - dateTime1.getTime(); 
    const workingHour = Math.floor(Math.pow(10,3) * (diff / (60*60*1000))) / Math.pow(10,3);
    const dateTimeNum = Number(String(editItem.createDate.replaceAll("-","")) + String(editItem.startTime.replaceAll(":","")))
    const perHour = editItem.kensu === 0 ? 0 : Math.floor(Math.pow(10,2) * (editItem.kensu / (diff / (60*60*1000)))) / Math.pow(10,2);
    
    const newItem = {
        ...editItem,
        workingHour,
        perHour,
        dateTimeNum,
    }

    const newData = {
        "id": newItem.id,
        "data": {
            ...newItem,
        }
    }

    const payload = {
        table_name,
        records: [
            newData
        ],
    };

    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        return {responseData, newData};
    } catch (error) {
        console.error("Error occurred while adding item:", error);
        throw error;
    }
}