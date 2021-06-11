import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

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

const gPromisesAdapter = createEntityAdapter<GPromise>({});

export const gPromiseSlice = createSlice({
  name: "counter",
  initialState: gPromisesAdapter.getInitialState({}),
  reducers: {
    addGPromise(state, action: PayloadAction<GPromise>) {
      gPromisesAdapter.addOne(state, action.payload);
    },
  },
});

export const { addGPromise } = gPromiseSlice.actions;

export default gPromiseSlice.reducer;
