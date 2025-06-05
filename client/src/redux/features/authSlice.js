import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { registerUser } from "../../service/auth";

// Async thunk to handle APIs
export const registerUserAPI = createAsyncThunk(
  "registerUserAPI",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await registerUser(credentials);
      console.log("register user response ->> ", response);
    } catch (error) {
      return rejectWithValue("User Registered Failed", error);
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
        state.error = ation.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
