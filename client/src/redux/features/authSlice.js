import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUser, refreshToken, registerUser } from "../../service/auth";

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

// Refersh Token 
export const refreshTokenAPI = createAsyncThunk(
  "refreshTokenAPI",
  async(_, {rejectWithValue}) => {
    try{
      const response = await refreshToken();
      console.log("Refresh Token Response ->> ", response);
      return response;
      
    }catch(error){
      return rejectWithValue(error.result || "refresh Token Failed..",error);
    }
  }
)

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
    logout(state) {
      // localStorage.removeItem("secure_access");
      state.isAuthenticated = false;
      state.data = null;
      state.error = null;
    },
    refreshTokenSuccess(state,action) {
      state.data = action.payload.user || state.data;    // this is optonal....this is update the redux store in new refresh token sucess.....
      state.isAuthenticated = true;
    }
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
        state.data = action.payload.data || action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUserAPI.rejected, (state, action) => {
        state.loading = true;
        state.error = action.payload;
      })

      .addCase(refreshTokenAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshTokenAPI.fulfilled, (state,action) => {
        state.loading = false;
        state.data = action.payload.data || action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(refreshTokenAPI.rejected, (state,action) => {
        state.loading = false;
        state.error = action.error;
        state.isAuthenticated = false;    // Logout on refresh fail
      })
  },
});

export const { logout,refreshTokenSuccess } = authSlice.actions;
export default authSlice.reducer;
