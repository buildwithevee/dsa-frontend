import { createSlice } from "@reduxjs/toolkit";

const initialData = {
    isAuth: false
}

const authSlice = createSlice({
    initialState: initialData,
    name: "auth",
    reducers: {
        setLogin: (state) => {
            state.isAuth = true;
        }
    }
})

export const { setLogin } = authSlice.actions;

export default authSlice.reducer;