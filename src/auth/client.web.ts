import React from "react";
import { createClient, type User } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

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

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!active) {
          return;
        }

        setData({ user: session?.user ?? null });
      }
    );

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
    const redirectTo =
      typeof window !== "undefined" ? window.location.href : undefined;

    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
      },
    });
  },
};

export async function signOut() {
  await supabase.auth.signOut();
}

