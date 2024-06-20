import { thunk } from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
import animationsReducers from "../reducers/animations-slice";

export const store = configureStore({
  reducer: {
    animations: animationsReducers,
  },
  middleware: () => [thunk],
  devTools: true,
});
