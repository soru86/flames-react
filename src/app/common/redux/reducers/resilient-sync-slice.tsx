// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Animation from "../../../shapes/animation";
import InputAnimation from "../../../shapes/input-animation";
import { syncAnimations } from "../../apollo/gql.apis";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface OfflineAnimationsState {
  offlineAnimations: Array<Animation>;
  syncStatus: "pending" | "completed";
}

const initialState: OfflineAnimationsState = {
  error: null,
  syncStatus: "pending",
  offlineAnimations: [],
};

export const syncOfflineAnimations = createAsyncThunk(
  "graphql/animations/sync",
  async (animations: Array<InputAnimation>, thunkAPI) => {
    let response = await syncAnimations(animations);
    return response;
  }
);

const offlineAnimationsSlice = createSlice({
  name: "offlineAnimations",
  initialState,
  reducers: {
    addOfflineAnimation: (state, action) => {
      const existingOfflineAnimations = state["offlineAnimations"];
      existingOfflineAnimations.push(action.payload);
      state["offlineAnimations"] = existingOfflineAnimations;
      state.syncStatus = "pending";
    },
    setSyncStatus: (state, action) => {
      state.syncStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncOfflineAnimations.pending, (state) => {
        state.syncStatus = "in progress";
      })
      .addCase(syncOfflineAnimations.fulfilled, (state, action) => {
        state.synStatus = "succeeded";
        if (state.syncStatus === "succeeded") {
          state["offlineAnimations"] = [];
        }
      })
      .addCase(syncOfflineAnimations.rejected, (state, action) => {
        state.synStatus = "failed";
        state.error = action.error.message;
      });
  },
});

export type AppDispatch = typeof store.dispatch;
export const { addOfflineAnimation, setSyncStatus } =
  offlineAnimationsSlice.actions;
export default offlineAnimationsSlice.reducer;
