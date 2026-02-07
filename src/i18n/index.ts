import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "intl-pluralrules";

import en from "./resources/en.json";
import zh from "./resources/zh.json";

const resources = {
  en: { translation: en },
  zh: { translation: zh },
};

const LANGUAGE_KEY = "user-language";

const initI18n = async () => {
  let language = Localization.getLocales()[0]?.languageCode ?? "en";

  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (savedLanguage) {
      language = savedLanguage;
    }
  } catch (error) {
    console.warn("Failed to load language preference:", error);
  }

  // Simple mapping for Chinese
  if (language.startsWith("zh")) {
    language = "zh";
  }

  i18n.use(initReactI18next).init({
    resources,
    lng: language,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React handles XSS
    },
    react: {
      useSuspense: false,
    },
  });
};

initI18n();

export default i18n;
