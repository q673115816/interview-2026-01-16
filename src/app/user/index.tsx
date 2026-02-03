import React from "react";
import { Text, TouchableOpacity, View, Platform } from "react-native";
import styled from "styled-components/native";

import { useSession, signIn, signOut, supabase } from "@/auth/client";
import { useStore } from "@/store";

function GoogleOneTap() {
  React.useEffect(() => {
    if (Platform.OS !== "web") return;

    const scriptId = "google-one-tap-script";
    if (document.getElementById(scriptId)) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.id = scriptId;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      // @ts-ignore
      if (!window.google) return;

      const clientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId) {
        console.warn("Google Client ID not found. One Tap disabled.");
        return;
      }

      // @ts-ignore
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: any) => {
          const { error } = await supabase.auth.signInWithIdToken({
            provider: "google",
            token: response.credential,
          });
          if (error) {
            console.error("Google One Tap Error:", error);
          }
        },
      });

      // @ts-ignore
      window.google.accounts.id.prompt();
    };
  }, []);

  return null;
}

const LoadingContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const LoginContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-horizontal: 16px;
`;

const LoginTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const ButtonGroup = styled.View`
  width: 100%;
  gap: 12px;
`;

const GithubButton = styled.TouchableOpacity`
  margin-bottom: 8px;
  border-radius: 6px;
  background-color: black;
  padding-horizontal: 16px;
  padding-vertical: 8px;
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
`;

const GithubButtonText = styled.Text`
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: white;
`;

const GoogleButton = styled.TouchableOpacity`
  border-radius: 6px;
  background-color: white;
  padding-horizontal: 16px;
  padding-vertical: 8px;
  border-width: 1px;
  border-color: #D1D5DB;
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
`;

const GoogleButtonText = styled.Text`
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #111827;
`;

const LoadingText = styled.Text`
  margin-top: 12px;
  font-size: 12px;
  color: #6B7280;
`;

const UserContainer = styled.View`
  flex: 1;
  padding-horizontal: 16px;
  padding-vertical: 24px;
`;

const UserTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const UserInfo = styled.View`
  gap: 8px;
  margin-bottom: 24px;
`;

const UserInfoText = styled.Text`
  font-size: 16px;
`;

const LogoutButton = styled.TouchableOpacity`
  border-radius: 6px;
  background-color: #111827;
  padding-horizontal: 16px;
  padding-vertical: 8px;
`;

const LogoutButtonText = styled.Text`
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #F9FAFB;
`;

export default function UserPage() {
  const { data, isPending } = useSession();
  const user = data?.user;
  const storeUser = useStore((state) => state.user);
  const currentUser = user ?? storeUser;
  const displayName =
    currentUser && typeof currentUser.user_metadata === "object"
      ? (currentUser.user_metadata as { name?: string; full_name?: string }).name ??
        (currentUser.user_metadata as { name?: string; full_name?: string }).full_name ??
        null
      : null;
  const [loadingProvider, setLoadingProvider] = React.useState<"github" | "google" | null>(null);
  const setUser = useStore((state) => state.setUser);
  const clearUser = useStore((state) => state.clearUser);

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

  React.useEffect(() => {
    if (isPending) {
      return;
    }

    if (user) {
      setUser(user);
    } else {
      clearUser();
    }
  }, [isPending, user, setUser, clearUser]);

  if (isPending && !currentUser) {
    return (
      <LoadingContainer>
        <Text>Loading user...</Text>
      </LoadingContainer>
    );
  }

  if (!currentUser) {
    return (
      <LoginContainer>
        <GoogleOneTap />
        <LoginTitle>
          尚未登录
        </LoginTitle>
        <ButtonGroup>
          <GithubButton
            onPress={() => {
              void handleSocialSignIn("github");
            }}
            disabled={loadingProvider !== null}
          >
            <GithubButtonText>
              使用 GitHub 登录
            </GithubButtonText>
          </GithubButton>
          <GoogleButton
            onPress={() => {
              void handleSocialSignIn("google");
            }}
            disabled={loadingProvider !== null}
          >
            <GoogleButtonText>
              使用 Google 登录
            </GoogleButtonText>
          </GoogleButton>
        </ButtonGroup>
        {loadingProvider && (
          <LoadingText>
            正在跳转 {loadingProvider === "github" ? "GitHub" : "Google"} 授权页面…
          </LoadingText>
        )}
      </LoginContainer>
    );
  }

  return (
    <UserContainer>
      <UserTitle>用户信息</UserTitle>
      <UserInfo>
        <UserInfoText>ID: {currentUser.id}</UserInfoText>
        {currentUser.email ? (
          <UserInfoText>邮箱: {currentUser.email}</UserInfoText>
        ) : null}
        {displayName ? <UserInfoText>昵称: {displayName}</UserInfoText> : null}
      </UserInfo>
      <LogoutButton
        onPress={() => {
          void handleSignOut();
        }}
      >
        <LogoutButtonText>
          退出登录
        </LogoutButtonText>
      </LogoutButton>
    </UserContainer>
  );
}
