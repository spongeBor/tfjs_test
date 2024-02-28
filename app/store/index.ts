import { createContext, useContext } from "react";
import transferModelStore from "./transferModel.store";

class RootStore {
  transferModelStore: typeof transferModelStore;
  constructor() {
    this.transferModelStore = transferModelStore;
  }
}
const rootStore = new RootStore();
const context = createContext(rootStore);
const useStore = () => useContext(context);

export { useStore };
