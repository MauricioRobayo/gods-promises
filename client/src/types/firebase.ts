import { functions } from "../features/firebase";

export const createFunction = <T = any, R = any>(
  name: string
): ((data: T) => Promise<R>) => {
  const callable = functions.httpsCallable(name);
  return async (data: T) => (await callable(data)).data;
};
