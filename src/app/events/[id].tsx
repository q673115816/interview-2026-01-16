import React from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

import { useEventQuery } from "@/api";
import { EventRoot } from "@/api/types";
import { Image } from "@/tw";

export default function EventDetailPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = params.id ?? "";

  const { data, isLoading, isError } = useEventQuery<EventRoot>(
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
  const poster =
    data.images?.find((image) => image.ratio === "16_9") ??
    data.images?.[0];

  const classification = data.classifications?.[0];
  const segmentName = classification?.segment?.name;
  const genreName = classification?.genre?.name;
  const subGenreName = classification?.subGenre?.name;

  const ticketLimitInfo = data.ticketLimit?.info;
  const legalAgeEnforced = data.ageRestrictions?.legalAgeEnforced;
  const promoterName = data.promoter?.name;
  const seatmapUrl = data.seatmap?.staticUrl;

  return (
    <View className="flex-1">
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200 bg-white">
        <TouchableOpacity
          className="mr-3 rounded-full bg-gray-100 px-3 py-1"
          onPress={() => {
            router.back();
          }}
        >
          <Text className="text-lg">←</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold" numberOfLines={1}>
          活动详情
        </Text>
      </View>
      <ScrollView className="flex-1 px-4 py-6">
        {poster && (
          <Image
            source={poster.url}
            className="mb-4 h-48 w-full rounded-md"
            style={{ objectFit: "cover" }}
          />
        )}
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
        {(segmentName || genreName || subGenreName) && (
          <Text className="text-base text-gray-600 mb-2">
            {[segmentName, genreName, subGenreName].filter(Boolean).join(" · ")}
          </Text>
        )}
        {promoterName ? (
          <Text className="text-base text-gray-600 mb-2">
            主办方: {promoterName}
          </Text>
        ) : null}
        {data.info ? (
          <Text className="text-base text-gray-800 mb-4">{data.info}</Text>
        ) : null}
        {data.pleaseNote ? (
          <Text className="text-sm text-gray-600">{data.pleaseNote}</Text>
        ) : null}
        {ticketLimitInfo ? (
          <Text className="text-sm text-gray-600 mt-2">{ticketLimitInfo}</Text>
        ) : null}
        {typeof legalAgeEnforced === "boolean" ? (
          <Text className="text-sm text-gray-600 mt-2">
            {legalAgeEnforced ? "需严格执行法定年龄限制" : "无明确法定年龄限制信息"}
          </Text>
        ) : null}
        {seatmapUrl ? (
          <Image
            source={seatmapUrl}
            className="mt-4 h-56 w-full rounded-md"
            style={{ objectFit: "contain" }}
          />
        ) : null}
      </ScrollView>
    </View>
  );
}
