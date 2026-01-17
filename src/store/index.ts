import {create} from "zustand";
import * as SecureStore from "expo-secure-store";
import {Platform} from "react-native";
import type { User } from "@supabase/supabase-js";

export interface Item {
  text: string;
  id: number;
}

export interface State {
  items: Item[];
  user: User | null;
}

export interface Actions {
  addItem: (text: string) => void;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export type Store = State & Actions;
const initialState: State = {
  items: [],
  user: null,
};

const userStorageKey = "app-user";

async function readStoredUser() {
  try {
    if (Platform.OS === "web") {
      if (typeof window === "undefined") {
        return null;
      }
      const raw = window.localStorage.getItem(userStorageKey);
      if (!raw) {
        return null;
      }
      return JSON.parse(raw) as User;
    }

    const raw = await SecureStore.getItemAsync(userStorageKey);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

async function writeStoredUser(user: User | null) {
  try {
    if (Platform.OS === "web") {
      if (typeof window === "undefined") {
        return;
      }
      if (!user) {
        window.localStorage.removeItem(userStorageKey);
        return;
      }
      window.localStorage.setItem(userStorageKey, JSON.stringify(user));
      return;
    }

    if (!user) {
      await SecureStore.deleteItemAsync(userStorageKey);
      return;
    }
    await SecureStore.setItemAsync(userStorageKey, JSON.stringify(user));
  } catch {
  }
}

export const useStore = create<Store>((set, get) => {
  void (async () => {
    const storedUser = await readStoredUser();
    if (storedUser && !get().user) {
      set({ user: storedUser });
    }
  })();

  return {
    ...initialState,
    addItem(text: string) {
      const items = get().items;
      set({ items: [...items, { text, id: Math.random() }] });
    },
    setUser(user: User | null) {
      set({ user });
      void writeStoredUser(user);
    },
    clearUser() {
      set({ user: null });
      void writeStoredUser(null);
    },
  };
});

export function useReset() {
  useStore.setState(initialState);
}
