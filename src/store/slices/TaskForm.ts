import { createSlice, PayloadAction  } from "@reduxjs/toolkit";

interface tasks {
    id: number;
    task: string;
    startTime: string;
    endTime: string;
    kensu: number;
}
interface initialState {
    tasks: tasks[];
}
interface updateTaskAction{
    id: number;
    field: string;
    value: string | number;
}

const initialState: initialState = {
    tasks: [
        { id: 1, task: '', startTime: '09:00', endTime: '09:00', kensu: 0 }
    ]
}

const taskSlice = createSlice({
    name: "taskFrom",
    initialState,
    reducers: {
        addTask: (state) => {
            const beforeTime = state.tasks[state.tasks.length - 1].endTime
            const newTask = { 
                id: Math.floor(Math.random() * 10000000), 
                task: '', 
                startTime: beforeTime, 
                endTime: beforeTime, 
                kensu: 0 
            };
            state.tasks.push(newTask)
        },
        removeTask: (state, action: PayloadAction<number>) => {
            if(state.tasks.length !== 1){
                state.tasks = state.tasks.filter(task => task.id !== action.payload);
            }
        },
        updateTask: (state, action: PayloadAction<updateTaskAction>) => {
            state.tasks = state.tasks.map(task => {
                return (
                    task.id === action.payload.id ? 
                    { ...task, [action.payload.field]: action.payload.value } : 
                    task
                )
            })
        },
        resetTask: (state) => {
            state.tasks = [
                { id: 1, task: '', startTime: '09:00', endTime: '09:00', kensu: 0 }
            ]
        }
    }
})

export const { addTask , removeTask , updateTask , resetTask } = taskSlice.actions;
export default taskSlice.reducer;