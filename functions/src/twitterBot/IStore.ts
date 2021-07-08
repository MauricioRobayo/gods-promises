export interface IStore<T> {
  get(): Promise<T | undefined>;
  set(data: T): Promise<void>;
}
