import { taskItemType } from "@/types/firebaseDocTypes"

const token = process.env.NEXT_PUBLIC_API_TOKEN;
const table_name = "firebase_taskManagers"

export const fetchTasks = async (): Promise<taskItemType[]> => {

    const url = "https://logiapp.rextlab.com/api/fetch-data"

    const payload = {
        table_name,
        "conditions": [
            {
                "column": "chk",
                "operator": "==",
                "value": true
            },
            {
                "column": "is_active",
                "operator": "=",
                "value": "1"
            },
        ],
        "order_by": {
            "column": "orderNum",
            "direction": "asc"
        }
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
};

export const fetchAllTasks = async (): Promise<taskItemType[]> => {

    const url = "https://logiapp.rextlab.com/api/fetch-data"

    const payload = {
        table_name,
        "conditions": [
            {
                "column": "is_active",
                "operator": "=",
                "value": "1"
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
        const sortData = responseData.data.sort((a: taskItemType, b: taskItemType) => a.orderNum - b.orderNum);
        return sortData;
    } catch (error) {
        console.error("Error occurred while adding item:", error);
        throw error;
    }
};

export const addTaskManager = async (newTasks: taskItemType[]) => {
    const url = "https://logiapp.rextlab.com/api/insert-data"

    const newData = newTasks.map(item => {
        return(
            {
                "chk": item.chk,
                "color": item.color,
                "orderNum": item.orderNum,
                "taskName": item.taskName,
                "is_active": 1,
            }
        )
    })

    const payload = {
        table_name,
        data: newData,
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

export const updateTaskManager = async(editItem: taskItemType[]) => {
    const url = "https://logiapp.rextlab.com/api/update-data"

    const newData = editItem.map(item => (
        {
            "id": item.id,
            "data": {
                ...item,
            }
        }
    ))

    const payload = {
        table_name,
        records: newData,
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
        return responseData;
    } catch (error) {
        console.error("Error occurred while adding item:", error);
        throw error;
    }
}