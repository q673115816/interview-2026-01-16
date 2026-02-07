import React from "react";
import { Text, TouchableOpacity, View, Platform } from "react-native";
import styled from "styled-components/native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";

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

const LanguageContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
`;

const LanguageButton = styled.TouchableOpacity<{ active: boolean }>`
  padding-horizontal: 12px;
  padding-vertical: 6px;
  border-radius: 999px;
  background-color: ${({ active }) => (active ? "#E5E7EB" : "transparent")};
`;

const LanguageText = styled.Text<{ active: boolean }>`
  font-size: 14px;
  font-weight: ${({ active }) => (active ? "600" : "400")};
  color: #111827;
`;

export default function UserPage() {
  const { t, i18n } = useTranslation();
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

  const [isSystemLanguage, setIsSystemLanguage] = React.useState(false);

  React.useEffect(() => {
    AsyncStorage.getItem("user-language").then((val) => {
      setIsSystemLanguage(val === null);
    });
  }, []);

  const changeLanguage = React.useCallback(
    async (lang: string | null) => {
      if (lang === null) {
        // Switch to system language
        await AsyncStorage.removeItem("user-language");
        let systemLang = Localization.getLocales()[0]?.languageCode ?? "en";
        if (systemLang.startsWith("zh")) {
          systemLang = "zh";
        }
        await i18n.changeLanguage(systemLang);
        setIsSystemLanguage(true);
      } else {
        await i18n.changeLanguage(lang);
        await AsyncStorage.setItem("user-language", lang);
        setIsSystemLanguage(false);
      }
    },
    [i18n],
  );

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
        <Text>{t("common.loading")}</Text>
      </LoadingContainer>
    );
  }

  if (!currentUser) {
    return (
      <LoginContainer>
        <GoogleOneTap />
        <LoginTitle>
          {t("user.notLoggedIn")}
        </LoginTitle>
        <ButtonGroup>
          <GithubButton
            onPress={() => {
              void handleSocialSignIn("github");
            }}
            disabled={loadingProvider !== null}
          >
            <GithubButtonText>
              {t("common.continueWith", { provider: "GitHub" })}
            </GithubButtonText>
          </GithubButton>
          <GoogleButton
            onPress={() => {
              void handleSocialSignIn("google");
            }}
            disabled={loadingProvider !== null}
          >
            <GoogleButtonText>
              {t("common.continueWith", { provider: "Google" })}
            </GoogleButtonText>
          </GoogleButton>
        </ButtonGroup>
        {loadingProvider && (
          <LoadingText>
            {t("common.redirecting", {
              provider: loadingProvider === "github" ? "GitHub" : "Google",
            })}
          </LoadingText>
        )}
        <LanguageContainer>
          <LanguageButton
            active={!isSystemLanguage && i18n.language === "en"}
            onPress={() => {
              void changeLanguage("en");
            }}
          >
            <LanguageText active={!isSystemLanguage && i18n.language === "en"}>English</LanguageText>
          </LanguageButton>
          <LanguageButton
            active={!isSystemLanguage && i18n.language === "zh"}
            onPress={() => {
              void changeLanguage("zh");
            }}
          >
            <LanguageText active={!isSystemLanguage && i18n.language === "zh"}>中文</LanguageText>
          </LanguageButton>
          <LanguageButton
            active={isSystemLanguage}
            onPress={() => {
              void changeLanguage(null);
            }}
          >
            <LanguageText active={isSystemLanguage}>{t("user.system")}</LanguageText>
          </LanguageButton>
        </LanguageContainer>
      </LoginContainer>
    );
  }

  return (
    <UserContainer>
      <UserTitle>{t("user.profile")}</UserTitle>
      <UserInfo>
        <UserInfoText>{t("user.id")}: {currentUser.id}</UserInfoText>
        {currentUser.email ? (
          <UserInfoText>{t("user.email")}: {currentUser.email}</UserInfoText>
        ) : null}
        {displayName ? <UserInfoText>{t("user.name")}: {displayName}</UserInfoText> : null}
      </UserInfo>
      <LogoutButton
        onPress={() => {
          void handleSignOut();
        }}
      >
        <LogoutButtonText>
          {t("common.logout")}
        </LogoutButtonText>
      </LogoutButton>
      <LanguageContainer>
        <LanguageButton
          active={!isSystemLanguage && i18n.language === "en"}
          onPress={() => {
            void changeLanguage("en");
          }}
        >
          <LanguageText active={!isSystemLanguage && i18n.language === "en"}>English</LanguageText>
        </LanguageButton>
        <LanguageButton
          active={!isSystemLanguage && i18n.language === "zh"}
          onPress={() => {
            void changeLanguage("zh");
          }}
        >
          <LanguageText active={!isSystemLanguage && i18n.language === "zh"}>中文</LanguageText>
        </LanguageButton>
        <LanguageButton
          active={isSystemLanguage}
          onPress={() => {
            void changeLanguage(null);
          }}
        >
          <LanguageText active={isSystemLanguage}>{t("user.system")}</LanguageText>
        </LanguageButton>
      </LanguageContainer>
    </UserContainer>
  );
}
