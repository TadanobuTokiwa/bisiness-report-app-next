import { createSlice, PayloadAction  } from "@reduxjs/toolkit";

interface tasks {
    id: number;
    task: string;
    startTime: string;
    endTime: string;
    kensu: number;
    team: string;
}
interface template {
    id: number;
    templateName: string;
    tasks: tasks[];
}
interface initialState {
    templates: template[]
}
interface upDateTaskPayload {
    id: number
    newTemplateName: string
}

const initialState: initialState = {
    templates: []
}

const templateSlice = createSlice({
    name: "templates",
    initialState,
    reducers: {
        addtemplate: (state, action: PayloadAction<template>) => {
            state.templates.push(action.payload)
        },
        removetemplate: (state, action: PayloadAction<number>) => {
            state.templates = state.templates.filter(template => template.id !== action.payload);
        },
        upDateTaskName: (state, action: PayloadAction<upDateTaskPayload>) => {
            state.templates = state.templates.map(item => {
                return (
                    item.id === action.payload.id ?
                    { ...item , templateName: action.payload.newTemplateName } :
                    item
                )
            })
        },
    }
})

export const { addtemplate , removetemplate, upDateTaskName } = templateSlice.actions;
export default templateSlice.reducer;