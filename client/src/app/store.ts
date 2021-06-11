import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import gPromisesReducer from "../features/gPromises/gPromisesSlice";

export const store = configureStore({
  reducer: {
    gPromises: gPromisesReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
