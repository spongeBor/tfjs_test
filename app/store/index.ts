import { createContext, useContext } from "react";
import model from "./model.store";

class RootStore {
  modelStore: typeof model;
  constructor() {
    this.modelStore = model;
  }
}
const rootStore = new RootStore();
const context = createContext(rootStore);
const useStore = () => useContext(context);

export { useStore };
