import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import * as api from "../../api"

export const login = createAsyncThunk("user/login", async ({ data, navigate }, { rejectWithValue }) => {
    try {
        const response = await api.signIn(data)
        console.log(response.data);
        window.location = "/"
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const otpLogin = createAsyncThunk("user/otpLogin", async ({ data, navigate }, { rejectWithValue }) => {
    try {
        const response = await api.otpLogin({ mob: data })
        const user = response.data
        localStorage.setItem('userToken', JSON.stringify(user));
        setUser(user)
        window.location = "/"
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const signUp = createAsyncThunk("user/signup", async ({ data, navigate }, { rejectWithValue }) => {
    try {
        const response = await api.signUp(data)
        navigate('/login')
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})



export const profile = createAsyncThunk("user/profile", async ({ user, navigate }, { rejectWithValue }) => {
    try {
        const response = await api.profile(user)
        navigate('/profile')
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const profilePicture = createAsyncThunk("user/profilePicture", async ({ profileData, navigate }, { rejectWithValue }) => {
    try {
        const response = await api.profilePicture(profileData)
        navigate('/profile')
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        error: "",
        loading: false,
        isEditing: false
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setLogout: (state, action) => {
            state.user = null
            localStorage.removeItem("userToken")
        },
        setIsEditing: (state, action) => {
            state.isEditing = action.payload;
        },
        updateUser: (state, action) => {
            const updatedUser = { ...state.user, user: action.payload };
            localStorage.setItem('userToken', JSON.stringify(updatedUser));
            state.user = updatedUser;
        },
    },
    extraReducers: {
        [login.pending]: (state, action) => {
            state.loading = true
        },
        [login.fulfilled]: (state, action) => {
            state.loading = false
            localStorage.setItem("userToken", JSON.stringify({ ...action.payload }))
            state.user = action.payload
        },
        [login.rejected]: (state, action) => {
            state.loading = false
            state.error = action.payload.message
        },
        [signUp.pending]: (state, action) => {
            state.loading = true
        },
        [signUp.fulfilled]: (state, action) => {
            state.loading = false
            localStorage.setItem("userToken", JSON.stringify({ ...action.payload }))
            state.user = action.payload
        },
        [signUp.rejected]: (state, action) => {
            state.loading = false
            state.error = action.payload.message
        },
    }
})

export const { setUser, setLogout, setIsEditing, updateUser } = userSlice.actions

export default userSlice.reducer 