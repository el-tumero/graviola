import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type Theme = "light" | "dark"

interface ThemeSettings {
    theme: Theme
}

const initialState: ThemeSettings = {
    theme: localStorage.getItem("theme") as Theme
}

export const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<Theme>) => {
            state.theme = action.payload
        },
    },
})

export const { setTheme } = themeSlice.actions
export default themeSlice.reducer
