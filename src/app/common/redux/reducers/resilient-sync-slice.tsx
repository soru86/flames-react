// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Animation from "../../../shapes/animation";
import InputAnimation from "../../../shapes/input-animation";
import { syncAnimations } from "../../apollo/gql.apis";
import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";

interface OfflineAnimationsState {
  offlineAnimations: Array<Animation>;
  syncStatus: "pending" | "completed";
}

const initialState: OfflineAnimationsState = {
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
    addOfflineAnimation: (state, action) => ({
      syncStatus: "pending",
      offlineAnimations: [...state.offlineAnimations, action.payload],
    }),
    findOfflineAnimationByTitle: (state, action) =>
      state?.offlineAnimations?.filter((oa) => oa.title === action.payload),
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncOfflineAnimations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(syncOfflineAnimations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.synStatus = "succeeded";
        if (state.syncStatus === "succeeded") {
          state.offlineAnimations = [];
        }
      })
      .addCase(syncOfflineAnimations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export type AppDispatch = typeof store.dispatch;
export const { addOfflineAnimation, findOfflineAnimationByTitle } =
  offlineAnimationsSlice.actions;
export default offlineAnimationsSlice.reducer;
