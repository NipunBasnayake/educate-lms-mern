import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllunits } from "../../service/unitsService";

// Get All Units
export const getAllUnitsAPI = createAsyncThunk(
  "getAllUnitsAPI",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllunits();
      console.log("Get All Units Response ->>", response);
      return response;
    } catch (error) {
      return rejectWithValue("All Units Fetch Failed...", error);
    }
  }
);

const initialState = {
  loading: false,
  data: null,
  error: null,
};

const unitsSlice = createSlice({
  name: "unitsSlice",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getAllUnitsAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUnitsAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAllUnitsAPI.rejected, (state, action) => {
        state.loading = true;
        state.error = action.payload;
      });
  },
});

export default unitsSlice.reducer;
