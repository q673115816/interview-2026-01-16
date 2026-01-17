import React from "react";
import { Text, View } from "react-native";

import { Link } from "@/tw";
import { useShallow } from 'zustand/react/shallow'

import { useReset, useStore } from "@/store";

if (process.env.NODE_ENV === "production") {
  console.log("EXPO_PUBLIC_SUPABASE_URL", process.env.EXPO_PUBLIC_SUPABASE_URL);
}

export default function Page() {
  const { items, addItem } = useStore(
    useShallow(({ addItem, items }) => ({
      items,
      addItem,
    })),
  );
  return (
    <View className="flex-1">
      <View className="py-12 md:py-24 lg:py-32 xl:py-48">
        <View className="px-4 md:px-6">
          <View className="flex flex-col items-center gap-4 text-center">
            <Text
              role="heading"
              className="text-3xl text-center native:text-5xl font-bold sm:text-4xl md:text-5xl lg:text-6xl font-rounded"
            >
              Ticketmaster 活动浏览
            </Text>
            <Text className="mx-auto max-w-[700px] text-lg text-center text-gray-500 md:text-xl dark:text-gray-400">
              在列表页中浏览活动，并进入详情页查看详细信息。
            </Text>

            <View className="gap-4">
              <Link
                suppressHighlighting
                className="flex h-9 items-center justify-center overflow-hidden rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 web:shadow ios:shadow transition-colors hover:bg-gray-900/90 active:bg-gray-400/90 web:focus-visible:outline-none web:focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                href="/events"
              >
                查看活动列表
              </Link>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
