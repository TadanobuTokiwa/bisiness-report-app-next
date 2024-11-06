import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import templateSliceReducer from './slices/Templates';
import taskSliceReducer from "./slices/TaskForm";

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['templates'], // 必要に応じて永続化したいSliceを指定
};

const persistedReducer = persistReducer(persistConfig, templateSliceReducer);

export const store = configureStore({
    reducer: {
        templates: persistedReducer,
        tasks: taskSliceReducer
    },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;