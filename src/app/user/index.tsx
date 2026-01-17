import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { useSession, signIn, signOut } from "@/auth/client";

export default function UserPage() {
  const { data, isPending } = useSession();
  const user = data?.user;
  const displayName =
    user && typeof user.user_metadata === "object"
      ? (user.user_metadata as { name?: string; full_name?: string }).name ??
        (user.user_metadata as { name?: string; full_name?: string }).full_name ??
        null
      : null;
  const [loadingProvider, setLoadingProvider] = React.useState<"github" | "google" | null>(null);

  const handleSocialSignIn = React.useCallback(
    async (provider: "github" | "google") => {
      try {
        setLoadingProvider(provider);
        await signIn.social({
          provider,
        });
      } finally {
        setLoadingProvider(null);
      }
    },
    [],
  );

  const handleSignOut = React.useCallback(async () => {
    await signOut();
  }, []);

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading user...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-lg font-semibold mb-4">
          尚未登录
        </Text>
        <View className="w-full gap-3">
          <TouchableOpacity
            className="mb-2 rounded-md bg-black px-4 py-2"
            onPress={() => {
              void handleSocialSignIn("github");
            }}
            disabled={loadingProvider !== null}
          >
            <Text className="text-center text-sm font-medium text-white">
              使用 GitHub 登录
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="rounded-md bg-white px-4 py-2 border border-gray-300"
            onPress={() => {
              void handleSocialSignIn("google");
            }}
            disabled={loadingProvider !== null}
          >
            <Text className="text-center text-sm font-medium text-gray-900">
              使用 Google 登录
            </Text>
          </TouchableOpacity>
        </View>
        {loadingProvider && (
          <Text className="mt-3 text-xs text-gray-500">
            正在跳转 {loadingProvider === "github" ? "GitHub" : "Google"} 授权页面…
          </Text>
        )}
      </View>
    );
  }

  return (
    <View className="flex-1 px-4 py-6">
      <Text className="text-2xl font-bold mb-4">用户信息</Text>
      <View className="gap-2 mb-6">
        <Text className="text-base">ID: {user.id}</Text>
        {user.email ? (
          <Text className="text-base">邮箱: {user.email}</Text>
        ) : null}
        {displayName ? <Text className="text-base">昵称: {displayName}</Text> : null}
      </View>
      <TouchableOpacity
        className="rounded-md bg-gray-900 px-4 py-2"
        onPress={() => {
          void handleSignOut();
        }}
      >
        <Text className="text-center text-sm font-medium text-gray-50">
          退出登录
        </Text>
      </TouchableOpacity>
    </View>
  );
}
