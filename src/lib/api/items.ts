import { listItemType, postItemType } from "@/types/firebaseDocTypes";

type fetchItemsPropsType = {
    startDate: string;
    endDate: string;
    userName: string;
}

export const addItem = async(newTask: postItemType) => {
    const url = "https://logiapp.rextlab.com/api/insert-data"
    const token = process.env.NEXT_PUBLIC_API_TOKEN;

    const payload = {
        table_name: "firebase_tasks",
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

export const fetchItems = async ({startDate, endDate, userName}: fetchItemsPropsType) => {
    const url = "https://logiapp.rextlab.com/api/fetch-data"
    const token = process.env.NEXT_PUBLIC_API_TOKEN;

    const payload = {
        "table_name": "firebase_tasks",
        "conditions": [
            {
                "column": "User",
                "operator": "==",
                "value": userName
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
        "order_by": {
            "column": "DateTimeNum",
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
        console.log(responseData.data);
        const fetchData = responseData.data.map((data: postItemType) => ({
            date: data.createDate,
            task: data.task,
            startTime: data.startTime,
            endTime: data.endTime,
            workingHour: data.workingHour,
            kensu: data.kensu,
            perHour: data.perHour,
            userName: data.User,
        })) as listItemType[]
        return fetchData;
    } catch (error) {
        console.error("Error occurred while adding item:", error);
        throw error;
    }
}