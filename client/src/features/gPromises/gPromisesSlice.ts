import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export type BibleId = "kjv" | "rvg";

export type Content = Partial<
  Record<
    BibleId,
    {
      text: string;
      reference: string;
    }
  >
>;
export type GPromise = {
  id: string;
  osis: string;
  niv: string;
  source: string;
  content: Content;
};

type InitialState = {
  currentGPromise?: GPromise;
  nextGPromise?: GPromise;
};

const gPromisesAdapter = createEntityAdapter<GPromise>({});

export const gPromiseSlice = createSlice({
  name: "counter",
  initialState: gPromisesAdapter.getInitialState<InitialState>({}),
  reducers: {
    addGPromise(state, action: PayloadAction<GPromise>) {
      gPromisesAdapter.addOne(state, action.payload);
    },
    setCurrentGPromise(state, action: PayloadAction<GPromise>) {
      state.currentGPromise = action.payload;
    },
    setNextGPromise(state, action: PayloadAction<GPromise>) {
      state.nextGPromise = action.payload;
    },
  },
});

export const { addGPromise, setCurrentGPromise, setNextGPromise } =
  gPromiseSlice.actions;
export const { selectAll: selectAllGPromises } = gPromisesAdapter.getSelectors(
  (state: RootState) => state.gPromises
);
export const selectCurrentGPromise = (state: RootState) =>
  state.gPromises.currentGPromise;
export const selectNextGPromise = (state: RootState) =>
  state.gPromises.nextGPromise;
export default gPromiseSlice.reducer;
