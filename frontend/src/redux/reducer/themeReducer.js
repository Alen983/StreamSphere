// import "@/styles/global.css";
import { createSlice } from "@reduxjs/toolkit";
import { Cookies } from "react-cookie";
// import { Provider } from "react-redux";

const cookies = new Cookies;

const themeSlice = createSlice({
    name: "activeTheme",
    initialState: {
        activeTheme: "light",
    },
    reducers: {
        getActiveTheme: (state) => {
            const cookieData = cookies.getAll();
            state.activeTheme = cookieData?.activeTheme ?? "light";
            // state.activeTheme == state.activeTheme ?? "light";
        },
        toggleTheme: (state) => {
            state.activeTheme = state.activeTheme === "light" ? "dark" : "light";
            cookies.set("activeTheme", state.activeTheme,{
                maxAge: 60*60*24,
            })
        },
    },

});

export const themeReducer = themeSlice.reducer;
export const {getActiveTheme, toggleTheme} = themeSlice.actions;
export const selectTheme = (state) => state.activeTheme;