import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface authSate {
    _id: string;
    email: string;
    name: string;
    role: string;
}

const initialState: authSate = {
    _id: "",
    email: "",
    name: "",
    role: ""
}


const authSlide = createSlice({
    name: "auth",
    initialState: {
        data: initialState
    },
    reducers: {
        addAuth: (state, action) => {
            state.data = action.payload
        }
    }
});

export const authReducer = authSlide.reducer
export const { addAuth } = authSlide.actions;

export const authSelector = (state: RootState) => state.auth.data
