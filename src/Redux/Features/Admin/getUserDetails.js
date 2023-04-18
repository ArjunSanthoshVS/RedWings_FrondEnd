import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as api from "../../api"

export const fetchUser = createAsyncThunk("admin/users", async (id) => {
    try {
        const response = await api.fetchUser(id)
        return response.data;
    } catch (error) {
        throw (error);
    }
})

const userDetailsSlice = createSlice({
    name: 'userDetails',
    initialState: null,
    reducers: {
        setUserDetails: (state, action) => action.payload,
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            return action.payload;
        })
    }
});

export const { setUserDetails } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;
