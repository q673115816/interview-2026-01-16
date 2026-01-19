import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styled from "styled-components/native";

import { Link, Slot, usePathname, useRouter } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

const queryClient = new QueryClient();

const NAV_ITEMS = [
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
] as const;

const MainContainer = styled.View`
  flex: 1;
  background-color: #FFFFFF;
`;

const ContentContainer = styled.View`
  flex: 1;
`;

const HeaderContainer = styled.View<{ paddingTop: number }>`
  padding-top: ${({ paddingTop }) => paddingTop}px;
`;

const HeaderBar = styled.View`
  height: 56px;
  flex-direction: row;
  align-items: center;
  padding-horizontal: 16px;
`;

const BackButton = styled.TouchableOpacity`
  margin-right: 12px;
  border-radius: 999px;
  background-color: #F3F4F6;
  padding-horizontal: 12px;
  padding-vertical: 4px;
`;

const BackButtonText = styled.Text`
  font-size: 18px;
`;

const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
`;

const BottomNavContainer = styled.View<{ paddingBottom: number }>`
  background-color: #FFFFFF;
  padding-bottom: ${({ paddingBottom }) => paddingBottom}px;
  border-top-width: ${StyleSheet.hairlineWidth}px;
  border-top-color: #E5E7EB;
`;

const BottomNavContent = styled.View`
  flex-direction: row;
  justify-content: space-around;
  padding-vertical: 8px;
`;

const NavItem = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding-horizontal: 24px;
`;

const NavText = styled.Text<{ isActive: boolean }>`
  font-size: 14px;
  font-weight: ${({ isActive }) => (isActive ? "600" : "400")};
  color: ${({ isActive }) => (isActive ? "#111827" : "#6B7280")};
`;

const FooterContainer = styled.View<{ paddingBottom: number }>`
  flex-shrink: 0;
  background-color: #F3F4F6;
  padding-bottom: ${({ paddingBottom }) => paddingBottom}px;
  display: none; 
`;

const FooterContent = styled.View`
  padding-vertical: 24px;
  flex: 1;
  align-items: flex-start;
  padding-horizontal: 16px;
`;

const FooterText = styled.Text`
  text-align: center;
  color: #374151;
`;

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainContainer>
        <Header />
        <ContentContainer>
          <Slot />
        </ContentContainer>
        <BottomNav />
        {/* <Footer /> */}
      </MainContainer>
    </QueryClientProvider>
  );
}

function Header() {
  const { top } = useSafeAreaInsets();
  const pathname = usePathname();
  const router = useRouter();

  const segments = pathname.split("/").filter(Boolean);

  let title: string | undefined;

  if (segments.length === 0) {
    title = NAV_ITEMS[0]?.label;
  } else {
    const topSegment = `/${segments[0]}`;
    const matched = NAV_ITEMS.find((item) => item.href === topSegment);

    if (matched && segments.length === 1) {
      title = matched.label;
    } else if (segments[0] === "events" && segments.length > 1) {
      title = "活动详情";
    }
  }

  if (!title) {
    title = "Ticketmaster 活动浏览";
  }

  const showBack = segments.length > 1;

  return (
    <HeaderContainer paddingTop={top}>
      <HeaderBar>
        {showBack ? (
          <BackButton
            onPress={() => {
              router.back();
            }}
          >
            <BackButtonText>←</BackButtonText>
          </BackButton>
        ) : null}
        <HeaderTitle numberOfLines={1}>
          {title}
        </HeaderTitle>
      </HeaderBar>
    </HeaderContainer>
  );
}

function BottomNav() {
  const pathname = usePathname();
  const { bottom } = useSafeAreaInsets();

  return (
    <BottomNavContainer paddingBottom={bottom}>
      <BottomNavContent>
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link key={item.href} href={item.href as any} asChild>
              <NavItem>
                <Ionicons
                  name={
                    (isActive ? item.activeIcon : item.icon) as keyof typeof Ionicons.glyphMap
                  }
                  size={22}
                  color={isActive ? "#111827" : "#6B7280"}
                />
                <NavText isActive={isActive}>
                  {item.label}
                </NavText>
              </NavItem>
            </Link>
          );
        })}
      </BottomNavContent>
    </BottomNavContainer>
  );
}

function Footer() {
  const { bottom } = useSafeAreaInsets();
  return (
    <FooterContainer paddingBottom={bottom}>
      <FooterContent>
        <FooterText>
          © {new Date().getFullYear()} Me
        </FooterText>
      </FooterContent>
    </FooterContainer>
  );
}
