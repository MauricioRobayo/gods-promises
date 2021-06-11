import { createSlice } from "@reduxjs/toolkit";

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

export const counterSlice = createSlice({
  name: "counter",
  initialState: {},
  reducers: {},
});

export default counterSlice.reducer;
