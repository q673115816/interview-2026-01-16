import React from "react";
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";

import { Image, Link } from "@/tw";
import { useEventsQuery } from "@/api";
import { EventsRoot } from "@/api/types";

export default function EventsPage() {
  const [keyword, setKeyword] = React.useState("");
  const [searchKeyword, setSearchKeyword] = React.useState("");

  const { data, isLoading, isError, refetch, isFetching } =
    useEventsQuery<EventsRoot>({
      size: 20,
      locale: "en-us",
      keyword: searchKeyword || undefined,
    });

  const events = data?._embedded?.events ?? [];

  return (
    <View className="flex-1 px-4 py-6">
      <View className="mb-3 rounded-md border border-gray-200 px-3 py-2">
        <TextInput
          placeholder="搜索活动"
          value={keyword}
          onChangeText={(text) => {
            setKeyword(text);
          }}
          onSubmitEditing={() => {
            setSearchKeyword(keyword.trim());
          }}
          className="text-base"
          returnKeyType="search"
        />
      </View>
      {isLoading || isFetching ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : null}
      {isError ? (
        <View className="mb-4">
          <Text className="text-red-500 mb-2">
            Failed to load events. Please try again.
          </Text>
          <TouchableOpacity
            className="rounded-md bg-gray-900 px-4 py-2"
            onPress={() => {
              refetch();
            }}
          >
            <Text className="text-gray-50 text-center">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const date = item.dates?.start?.localDate ?? "";
          const time = item.dates?.start?.localTime ?? "";
          const status = item.dates?.status?.code ?? "";

          const classification = item.classifications?.[0];
          const segmentName = classification?.segment?.name;
          const genreName = classification?.genre?.name;
          const subGenreName = classification?.subGenre?.name;

          const venue = item._embedded?.venues?.[0];
          const venueName = venue?.name;
          const cityName = venue?.city?.name;
          const countryName = venue?.country?.name;

          const poster =
            item.images?.find((image) => image.ratio === "16_9") ??
            item.images?.[0];

          return (
            <Link
              href={{
                pathname: "/events/[id]",
                params: { id: item.id },
              }}
              asChild
            >
              <TouchableOpacity className="mb-3 rounded-lg border border-gray-200 px-4 py-3">
                {poster && (
                  <Image
                    source={poster.url}
                    className="mb-2 h-40 w-full rounded-md"
                    style={{ objectFit: "cover" }}
                  />
                )}
                <Text className="text-base font-semibold mb-1">
                  {item.name}
                </Text>
                <Text className="text-xs text-gray-500 mb-1">
                  {item.type} · {status}
                </Text>
                <Text className="text-sm text-gray-700 mb-1">
                  {date} {time}
                </Text>
                {(segmentName || genreName || subGenreName) && (
                  <Text className="text-xs text-gray-500 mb-1">
                    {[segmentName, genreName, subGenreName].filter(Boolean).join(" · ")}
                  </Text>
                )}
                {(venueName || cityName || countryName) && (
                  <Text className="text-xs text-gray-500">
                    {venueName}
                    {cityName ? ` · ${cityName}` : ""}
                    {countryName ? ` · ${countryName}` : ""}
                  </Text>
                )}
              </TouchableOpacity>
            </Link>
          );
        }}
        contentContainerStyle={{
          paddingBottom: 16,
        }}
        ListEmptyComponent={
          !isLoading && !isError ? (
            <Text className="text-gray-500">No events found.</Text>
          ) : null
        }
      />
    </View>
  );
}
