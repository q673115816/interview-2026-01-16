import React from "react";
import { createClient, type User } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

type SessionData = {
  user: User | null;
};

export function useSession() {
  const [data, setData] = React.useState<SessionData | null>(null);
  const [isPending, setIsPending] = React.useState(true);

  React.useEffect(() => {
    let active = true;

    async function load() {
      const { data, error } = await supabase.auth.getSession();

      if (!active) {
        return;
      }

      if (error) {
        setData({ user: null });
      } else {
        setData({ user: data.session?.user ?? null });
      }

      setIsPending(false);
    }

    void load();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) {
        return;
      }

      setData({ user: session?.user ?? null });
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return { data, isPending };
}

type Provider = "github" | "google";

export const signIn = {
  social: async ({ provider }: { provider: Provider }) => {
    // Web implementation
    if (Platform.OS === "web") {
      const redirectTo =
        typeof window !== "undefined" ? window.location.origin : undefined;

      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
        },
      });
      return;
    }

    // Native implementation
    const redirectTo = Linking.createURL("/");

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;

    if (data?.url) {
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectTo
      );

      if (result.type === "success" && result.url) {
        // Parse the URL to get the session
        const params = extractParamsFromUrl(result.url);

        if (params.access_token && params.refresh_token) {
          await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });
        }
      }
    }
  },
};

function extractParamsFromUrl(url: string) {
  const params: Record<string, string> = {};

  // Check for hash parameters (Supabase usually returns tokens in hash)
  const hashIndex = url.indexOf("#");
  if (hashIndex !== -1) {
    const hash = url.substring(hashIndex + 1);
    hash.split("&").forEach((part) => {
      const [key, value] = part.split("=");
      if (key && value) {
        params[key] = decodeURIComponent(value);
      }
    });
  }

  // Check for query parameters (fallback or error)
  const queryIndex = url.indexOf("?");
  if (queryIndex !== -1) {
    // If hash exists, query is before hash
    const end = hashIndex !== -1 ? hashIndex : undefined;
    const query = url.substring(queryIndex + 1, end);
    query.split("&").forEach((part) => {
      const [key, value] = part.split("=");
      if (key && value) {
        params[key] = decodeURIComponent(value);
      }
    });
  }

  return params;
}

export async function signOut() {
  await supabase.auth.signOut();
}
