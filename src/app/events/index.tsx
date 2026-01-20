import React from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { Image } from "expo-image";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

import { searchEvents, useAttractionQuery } from "@/api";
import { EventsRoot } from "@/api/types";
import { formatDate, formatTime } from "@/utils/format";

const Container = styled.View`
  flex: 1;
  background-color: #f9fafb;
  padding-horizontal: 16px;
  padding-vertical: 16px;
`;

const SearchContainer = styled.View`
  margin-bottom: 16px;
  flex-direction: row;
  align-items: center;
  border-radius: 9999px;
  border-width: 1px;
  border-color: #e5e7eb;
  background-color: white;
  padding-horizontal: 16px;
  padding-vertical: 4px;
  elevation: 1;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 2px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 15px;
  text-align-vertical: center;
  height: 40px;
  padding-vertical: 0px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const ErrorContainer = styled.View`
  margin-bottom: 16px;
`;

const ErrorText = styled.Text`
  color: #EF4444;
  margin-bottom: 8px;
`;

const RetryButton = styled.TouchableOpacity`
  border-radius: 6px;
  background-color: #111827;
  padding-horizontal: 16px;
  padding-vertical: 8px;
`;

const RetryButtonText = styled.Text`
  color: #F9FAFB;
  text-align: center;
`;

const EmptyText = styled.Text`
  color: #6b7280;
`;

const EventCard = styled.TouchableOpacity`
  margin-bottom: 12px;
  border-radius: 12px;
  border-width: 1px;
  border-color: #e5e7eb;
  background-color: white;
  padding-horizontal: 16px;
  padding-vertical: 12px;
  elevation: 1;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 2px;
`;

const EventImage = styled(Image)`
  margin-bottom: 8px;
  height: 160px;
  width: 100%;
  border-radius: 6px;
`;

const EventTitle = styled.Text`
  margin-bottom: 4px;
  font-size: 16px;
  font-weight: 600;
`;

const EventMeta = styled.Text`
  margin-bottom: 4px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #6b7280;
`;

const EventDate = styled.Text`
  font-size: 14px;
  color: #111827;
`;

const EventSubMeta = styled.Text`
  margin-bottom: 4px;
  font-size: 12px;
  color: #6b7280;
`;

const EventLocation = styled.Text`
  font-size: 12px;
  color: #6b7280;
`;

const AttractionText = styled.Text`
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
`;

const CardHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const StatusPill = styled.View<{ status?: string }>`
  padding-vertical: 2px;
  padding-horizontal: 8px;
  border-radius: 9999px;
  background-color: ${(props) =>
    props.status === "onsale"
      ? "#dcfce7"
      : props.status === "offsale" || props.status === "cancelled"
      ? "#fee2e2"
      : "#e5e7eb"};
`;

const StatusPillText = styled.Text<{ status?: string }>`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${(props) =>
    props.status === "onsale"
      ? "#16a34a"
      : props.status === "offsale" || props.status === "cancelled"
      ? "#b91c1c"
      : "#4b5563"};
`;

const MetaRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
`;

const MetaIcon = styled(Ionicons)`
  margin-right: 4px;
`;

const BadgeRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 6px;
`;

const Badge = styled.View`
  padding-vertical: 2px;
  padding-horizontal: 8px;
  border-radius: 9999px;
  background-color: #eff6ff;
  margin-right: 6px;
  margin-bottom: 4px;
`;

const BadgeText = styled.Text`
  font-size: 11px;
  color: #1d4ed8;
  font-weight: 500;
`;


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
    <Container>
      <SearchContainer>
        <SearchInput
          placeholder="搜索活动"
          placeholderTextColor="#9CA3AF"
          value={keyword}
          onChangeText={(text) => {
            setKeyword(text);
          }}
          onSubmitEditing={() => {
            setSearchKeyword(keyword.trim());
          }}
          returnKeyType="search"
        />
      </SearchContainer>
      {isLoading ? (
        <LoadingContainer>
          <ActivityIndicator />
        </LoadingContainer>
      ) : null}
      {isError ? (
        <ErrorContainer>
          <ErrorText>
            Failed to load events. Please try again.
          </ErrorText>
          <RetryButton
            onPress={() => {
              refetch();
            }}
          >
            <RetryButtonText>Retry</RetryButtonText>
          </RetryButton>
        </ErrorContainer>
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

          const salesPublic = item.sales?.public;
          const presales = item.sales?.presales ?? [];

          const hasSafeTix = item.ticketing?.safeTix?.enabled;
          const hasAllInclusive = item.ticketing?.allInclusivePricing?.enabled;
          const hasAgeRestriction = item.ageRestrictions?.legalAgeEnforced;

          const attraction = item._embedded?.attractions?.[0];

          const poster =
            item.images?.slice().reverse().find((image) => image.ratio === "16_9")?.url ??
            require("@/../icon.png");

          return (
            <Link
              href={{
                pathname: "/events/[id]",
                params: { id: item.id },
              }}
              asChild
            >
              <EventCard>
                <EventImage
                  source={typeof poster === "string" ? { uri: poster } : poster}
                  contentFit="cover"
                />
                <CardHeaderRow>
                  <EventTitle numberOfLines={1}>{item.name}</EventTitle>
                  {status ? (
                    <StatusPill status={status}>
                      <StatusPillText status={status}>{status}</StatusPillText>
                    </StatusPill>
                  ) : null}
                </CardHeaderRow>
                <MetaRow>
                  <MetaIcon name="calendar-outline" size={14} color="#6B7280" />
                  <EventDate>
                    {[formatDate(date), formatTime(time)].filter(Boolean).join(" ")}
                  </EventDate>
                </MetaRow>
                {attraction?.id ? (
                  <AttractionPreview id={attraction.id} />
                ) : null}
                {(segmentName || genreName || subGenreName) && (
                  <EventSubMeta numberOfLines={1}>
                    {[segmentName, genreName, subGenreName].filter(Boolean).join(" · ")}
                  </EventSubMeta>
                )}
                {(venueName || cityName || countryName) && (
                  <MetaRow>
                    <MetaIcon name="location-outline" size={14} color="#6B7280" />
                    <EventLocation numberOfLines={1}>
                      {venueName}
                      {cityName ? ` · ${cityName}` : ""}
                      {countryName ? ` · ${countryName}` : ""}
                    </EventLocation>
                  </MetaRow>
                )}
                <BadgeRow>
                  {item.type ? (
                    <Badge>
                      <BadgeText>{item.type}</BadgeText>
                    </Badge>
                  ) : null}
                  {salesPublic ? (
                    <Badge>
                      <BadgeText>
                        公售 {new Date(salesPublic.startDateTime).toLocaleDateString()}
                      </BadgeText>
                    </Badge>
                  ) : null}
                  {presales.length > 0 ? (
                    <Badge>
                      <BadgeText>预售 {presales.length} 场</BadgeText>
                    </Badge>
                  ) : null}
                  {hasSafeTix ? (
                    <Badge>
                      <BadgeText>SafeTix</BadgeText>
                    </Badge>
                  ) : null}
                  {hasAllInclusive ? (
                    <Badge>
                      <BadgeText>含所有费用</BadgeText>
                    </Badge>
                  ) : null}
                  {hasAgeRestriction ? (
                    <Badge>
                      <BadgeText>年龄限制</BadgeText>
                    </Badge>
                  ) : null}
                </BadgeRow>
              </EventCard>
            </Link>
          );
        }}
        contentContainerStyle={{
          paddingTop: 4,
          paddingBottom: 20,
        }}
        ListEmptyComponent={
          !isLoading && !isError ? (
            <EmptyText>No events found.</EmptyText>
          ) : null
        }
        ListFooterComponent={
          isFetchingNextPage && hasNextPage ? (
            <View style={{ paddingVertical: 16 }}>
              <ActivityIndicator />
            </View>
          ) : null
        }
      />
    </Container>
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
    <AttractionText numberOfLines={1}>
      演出方: {name}
    </AttractionText>
  );
}
