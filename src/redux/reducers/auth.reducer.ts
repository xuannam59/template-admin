import { createSlice } from "@reduxjs/toolkit";

export interface authSate {
    isAuthenticated: boolean,
    isLoading: boolean
    user: {
        _id: string;
        email: string;
        name: string;
        role: {
            _id: string;
            title: string;
        };
        avatar: string;
        permissions: {
            _id: string;
            method: string;
            module: string;
            apiPath: string;
        }[]
    }
}

const initialState: authSate = {
    isAuthenticated: false,
    isLoading: true,
    user: {
        _id: "",
        email: "",
        name: "",
        role: {
            _id: "",
            title: ""
        },
        avatar: "",
        permissions: []
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
                role: {
                    _id: "",
                    title: ""
                },
                avatar: "",
                permissions: []
            };
        }
    }
});

export const authReducer = authSlide.reducer
export const { doLoginAction, doGetAccountAction, doLogOutAction } = authSlide.actions;

