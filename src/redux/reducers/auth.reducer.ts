import { createSlice } from "@reduxjs/toolkit";

export interface authSate {
    isAuthenticated: boolean,
    isLoading: boolean
    user: {
        _id: string;
        email: string;
        name: string;
        role: string;
        avatar: string
    }
}

const initialState: authSate = {
    isAuthenticated: false,
    isLoading: true,
    user: {
        _id: "",
        email: "",
        name: "",
        role: "",
        avatar: ""
    }
}


const authSlide = createSlice({
    name: "auth",
    initialState,
    reducers: {
        doLoginAction: (state, action) => {
            state.isAuthenticated = true;
            state.isLoading = false;
            state.user = action.payload;
        },
        doGetAccountAction: (state, action) => {
            state.isAuthenticated = true;
            state.isLoading = false;
            state.user = action.payload;
        },
        doLogOutAction: (state, action) => {
            localStorage.removeItem("access_token");
            state.isAuthenticated = false;
            state.user = {
                _id: "",
                email: "",
                name: "",
                role: "",
                avatar: ""
            };
        }
    }
});

export const authReducer = authSlide.reducer
export const { doLoginAction, doGetAccountAction, doLogOutAction } = authSlide.actions;

