import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";

import { Image, Link } from "@/tw";
import { searchEvents, useAttractionQuery } from "@/api";
import { EventsRoot } from "@/api/types";

export default function EventsPage() {
  const [keyword, setKeyword] = React.useState("");
  const [searchKeyword, setSearchKeyword] = React.useState("");

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<EventsRoot, Error>({
    queryKey: [
      "events",
      {
        size: 20,
        locale: "en-us",
        keyword: searchKeyword || undefined,
      },
    ],
    queryFn: ({ pageParam = 0 }) =>
      searchEvents<EventsRoot>({
        size: 20,
        locale: "en-us",
        keyword: searchKeyword || undefined,
        page: pageParam as number,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const pageInfo = lastPage.page;
      if (!pageInfo) {
        return undefined;
      }
      const next = pageInfo.number + 1;
      if (next >= pageInfo.totalPages) {
        return undefined;
      }
      return next;
    },
  });

  const events =
    data?.pages.flatMap((page) => page._embedded?.events ?? []) ?? [];

  const handleEndReached = () => {
    if (isLoading || isFetchingNextPage || !hasNextPage) {
      return;
    }

    fetchNextPage();
  };

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
      {isLoading ? (
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
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
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

          const attraction = item._embedded?.attractions?.[0];

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
                {attraction?.id ? (
                  <AttractionPreview id={attraction.id} />
                ) : null}
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
        ListFooterComponent={
          isFetchingNextPage && hasNextPage ? (
            <View className="py-4">
              <ActivityIndicator />
            </View>
          ) : null
        }
      />
    </View>
  );
}

function AttractionPreview({ id }: { id: string }) {
  const { data, isLoading, isError } = useAttractionQuery<any>(id, undefined, {
    enabled: !!id,
  });

  if (isLoading || isError || !data) {
    return null;
  }

  const name = (data as { name?: string }).name;

  if (!name) {
    return null;
  }

  return (
    <Text className="text-xs text-gray-500 mb-1" numberOfLines={1}>
      演出方: {name}
    </Text>
  );
}
