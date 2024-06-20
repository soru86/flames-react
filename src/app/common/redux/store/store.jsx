import { thunk } from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
import animationsReducers from "../reducers/animations-slice";
import offlineAnimationsReducers from "../reducers/resilient-sync-slice";

export const store = configureStore({
  reducer: {
    animations: animationsReducers,
    offlineAnimations: offlineAnimationsReducers,
  },
  middleware: () => [thunk],
  devTools: true,
});
