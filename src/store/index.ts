import {create} from "zustand";

export interface Item {
  text: string;
  id: number;
}

export interface State {
  items: Item[];
}

export interface Actions {
  addItem: (text: string) => void;
}

export type Store = State & Actions;
const initialState: State = {
  items: [],
};

export const useStore = create<Store>((set, get) => {
  return Object.assign(initialState, {
    items: [],
    addItem(text: string) {
      const items = get().items;
      set({ items: [...items, { text, id: Math.random() }] });
    },
  });
});

export function useReset() {
  useStore.setState(initialState);
}