import "../global.css";
import { Slot } from "expo-router";

import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Image, Link } from "@/tw";
import { usePathname } from "expo-router";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

const queryClient = new QueryClient();


export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <View className="flex flex-1 bg-white">
        {/* <Header /> */}
        <View className="flex-1">
          <Slot />
        </View>
        <BottomNav />
        {/* <Footer /> */}
      </View>
    </QueryClientProvider>
  );
}

function Header() {
  const { top } = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: top }}>
      <View className="px-4 lg:px-6 h-14 flex items-center flex-row">
        <View className="flex flex-row gap-4 sm:gap-6">
        </View>
      </View>
    </View>
  );
}

function BottomNav() {
  const pathname = usePathname();

  const items = [
    { href: "/", label: "首页", icon: "home-outline", activeIcon: "home" },
    {
      href: "/events",
      label: "活动",
      icon: "albums-outline",
      activeIcon: "albums",
    },
    {
      href: "/user",
      label: "我的",
      icon: "person-outline",
      activeIcon: "person",
    },
  ];

  return (
    <View className="flex border-t border-gray-200 bg-white">
      <View className="flex flex-row justify-around py-2">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href as any}
              className="flex-1"
              asChild
            >
              <View className="flex-1 items-center justify-center gap-1">
                <Ionicons
                  name={
                    (isActive ? item.activeIcon : item.icon) as keyof typeof Ionicons.glyphMap
                  }
                  size={22}
                  color={isActive ? "#111827" : "#6B7280"}
                />
                <Text
                  className={
                    isActive
                      ? "text-sm font-semibold text-gray-900"
                      : "text-sm text-gray-500"
                  }
                >
                  {item.label}
                </Text>
              </View>
            </Link>
          );
        })}
      </View>
    </View>
  );
}

function Footer() {
  const { bottom } = useSafeAreaInsets();
  return (
    <View
      className="flex shrink-0 bg-gray-100 native:hidden"
      style={{ paddingBottom: bottom }}
    >
      <View className="py-6 flex-1 items-start px-4 md:px-6 ">
        <Text className={"text-center text-gray-700"}>
          © {new Date().getFullYear()} Me
        </Text>
      </View>
    </View>
  );
}
