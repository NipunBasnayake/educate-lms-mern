import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "../../service/auth";

// Async thunk to handle APIs

// Register User
export const registerUserAPI = createAsyncThunk(
  "registerUserAPI",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await registerUser(credentials);
      console.log("register user response ->> ", response);
      return response;
    } catch (error) {
      return rejectWithValue("User Registered Failed", error);
    }
  }
);

// Login User
export const loginUserAPI = createAsyncThunk(
  "loginUserAPI",
  async (credentils, { rejectWithValue }) => {
    try {
      const response = await loginUser(credentils);
      console.log("Login User Response _>> ", response);

      // set access token
      // result.data.token
      localStorage.setItem("user", response.data.user.id);

      return response;
    } catch (error) {
      return rejectWithValue("User Login Falied", error);
    }
  }
);

const initialState = {
  loading: false,
  isAuthenticated: false,
  data: null,
  error: null,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("secure_access");
      state.isAuthenticated = false;
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUserAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(registerUserAPI.rejected, (state, ation) => {
        state.loading = false;
        state.error = ation.error;
      })

      .addCase(loginUserAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUserAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(loginUserAPI.rejected, (state, action) => {
        state.loading = true;
        state.error = action.error;
      })
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
