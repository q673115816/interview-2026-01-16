import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import { useLocalSearchParams } from "expo-router";

import { useEventQuery } from "@/api";

type EventDetail = {
  id: string;
  name: string;
  info?: string;
  pleaseNote?: string;
  dates?: {
    start?: {
      localDate?: string;
      localTime?: string;
    };
  };
  _embedded?: {
    venues?: {
      name?: string;
      city?: {
        name?: string;
      };
      country?: {
        name?: string;
      };
    }[];
  };
};

export default function EventDetailPage() {
  const params = useLocalSearchParams<{ id?: string }>();
  const id = params.id ?? "";

  const { data, isLoading, isError } = useEventQuery<EventDetail>(
    id,
    undefined,
    {
      enabled: !!id,
    },
  );

  if (!id) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-red-500">Missing event id.</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-red-500">
          Failed to load event details. Please try again later.
        </Text>
      </View>
    );
  }

  const date = data.dates?.start?.localDate;
  const time = data.dates?.start?.localTime;
  const venue = data._embedded?.venues?.[0];

  return (
    <ScrollView className="flex-1 px-4 py-6">
      <Text className="text-2xl font-bold mb-2">{data.name}</Text>
      {date || time ? (
        <Text className="text-base text-gray-600 mb-2">
          {date} {time}
        </Text>
      ) : null}
      {venue ? (
        <Text className="text-base text-gray-600 mb-4">
          {venue.name}
          {venue.city?.name ? ` · ${venue.city.name}` : ""}
          {venue.country?.name ? ` · ${venue.country.name}` : ""}
        </Text>
      ) : null}
      {data.info ? (
        <Text className="text-base text-gray-800 mb-4">{data.info}</Text>
      ) : null}
      {data.pleaseNote ? (
        <Text className="text-sm text-gray-600">{data.pleaseNote}</Text>
      ) : null}
    </ScrollView>
  );
}