import { configureStore } from "@reduxjs/toolkit";
import taskSliceReducer from "./slices/TaskForm";

export const store = configureStore({
    reducer: {
        tasks: taskSliceReducer
    },
});

// RootState型とAppDispatch型をエクスポート
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;