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
  currentGPromise: GPromise | null;
  nextGPromise: GPromise | null;
};

const gPromisesAdapter = createEntityAdapter<GPromise>({});

export const gPromiseSlice = createSlice({
  name: "counter",
  initialState: gPromisesAdapter.getInitialState<InitialState>({
    currentGPromise: null,
    nextGPromise: null,
  }),
  reducers: {
    addGPromise(state, action: PayloadAction<GPromise>) {
      gPromisesAdapter.addOne(state, action.payload);
    },
    setCurrentGPromise(state, action: PayloadAction<GPromise>) {
      state.currentGPromise = action.payload;
    },
    setNextGPromise(state, action: PayloadAction<GPromise | null>) {
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
export const selectRandomGPromise = ({ gPromises }: RootState) => {
  const randomIdx =
    gPromises.ids[Math.floor(Math.random() * gPromises.ids.length)];
  return gPromises.entities[randomIdx];
};
export default gPromiseSlice.reducer;
