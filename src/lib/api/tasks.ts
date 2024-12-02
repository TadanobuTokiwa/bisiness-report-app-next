import { taskItemType } from "@/types/firebaseDocTypes"

export const fetchTasks = async (): Promise<taskItemType[]> => {

    const url = "https://logiapp.rextlab.com/api/fetch-data"
    const token = process.env.NEXT_PUBLIC_API_TOKEN;

    const payload = {
        "table_name": "firebase_taskManagers",
        "conditions": [
            {
                "column": "chk",
                "operator": "==",
                "value": true
            }
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

