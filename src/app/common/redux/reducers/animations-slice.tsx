// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Animation from "../../../shapes/animation";
import InputAnimation from "../../../shapes/input-animation";
import InputSearch from "../../../shapes/input-search";
import {
  queryAllAnimations,
  queryAnimationById,
  createAnimation,
  queryAnimationsByTitle,
} from "../../apollo/gql.apis";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface AnimationsState {
  status: string;
  error: any;
  animations: Array<Animation>;
  currentAnimation: Animation;
  networkStatus: string;
}

const initialState: AnimationsState = {
  status: "idle",
  error: null,
  animations: [],
  currentAnimation: {},
  networkStatus: "online",
};

export const fetchAnimations = createAsyncThunk(
  "graphql/animations",
  async (thunkAPI) => {
    const response = await queryAllAnimations();
    return response;
  }
);

export const fetchAnimationById = createAsyncThunk(
  "graphql/animations/id",
  async (animationId: string, thunkAPI) => {
    const response = await queryAnimationById(animationId);
    return response;
  }
);

export const addAnimation = createAsyncThunk(
  "graphql/animations/new",
  async (animation: InputAnimation, thunkAPI) => {
    let response = await createAnimation(animation);
    return response.data.addAnimation as Animation;
  }
);

export const searchAnimations = createAsyncThunk(
  "graphql/animations/search",
  async (searchData: InputSearch, thunkAPI) => {
    let response = await queryAnimationsByTitle(searchData.search);
    return response;
  }
);

const animationsSlice = createSlice({
  name: "animations",
  initialState,
  reducers: {
    getAllAnimations: (state, action) => state?.animations,
    getCurrentAnimation: (state, action) => state?.currentAnimation,
    setNetworkStatus: (state, action) => {
      state.networkStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnimations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAnimations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.animations = action.payload;
      })
      .addCase(fetchAnimations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchAnimationById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAnimationById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentAnimation = action.payload;
      })
      .addCase(fetchAnimationById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addAnimation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addAnimation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.animations.push(action.payload);
      })
      .addCase(addAnimation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(searchAnimations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchAnimations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.animations = action.payload;
      })
      .addCase(searchAnimations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export type AppDispatch = typeof store.dispatch;
export const { getAllAnimations, getCurrentAnimation, setNetworkStatus } =
  animationsSlice.actions;
export default animationsSlice.reducer;
