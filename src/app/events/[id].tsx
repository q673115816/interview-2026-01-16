import React from "react";
import { ActivityIndicator, Share, Linking, Platform } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import styled from "styled-components/native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { useTranslation } from "react-i18next";

import { useEventQuery } from "@/api";
import { EventRoot } from "@/api/types";

// --- Styled Components ---

const Container = styled.View`
  flex: 1;
  background-color: #f8f9fa;
`;

const ScrollContent = styled.ScrollView.attrs({
  contentContainerStyle: { paddingBottom: 100 },
})`
  flex: 1;
`;

const HeroContainer = styled.View`
  position: relative;
  height: 280px;
  width: 100%;
`;

const HeroImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

const HeroOverlay = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  justify-content: flex-end;
  padding: 20px;
`;

const StatusBadge = styled.View<{ status?: string }>`
  background-color: ${(props) =>
    props.status === "cancelled"
      ? "#EF4444"
      : props.status === "rescheduled"
      ? "#F59E0B"
      : "#10B981"};
  padding: 4px 8px;
  border-radius: 4px;
  align-self: flex-start;
  margin-bottom: 8px;
`;

const StatusText = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
`;

const EventTitle = styled.Text`
  color: white;
  font-size: 28px;
  font-weight: bold;
  text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.5);
  margin-bottom: 4px;
`;

const EventSubtitle = styled.Text`
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  font-weight: 500;
`;

const SectionContainer = styled.View`
  padding: 20px;
  gap: 16px;
`;

const Card = styled.View`
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
  shadow-radius: 4px;
  elevation: 2;
  margin-bottom: 16px;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
  gap: 8px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
`;

const InfoRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 12px;
`;

const InfoContent = styled.View`
  flex: 1;
`;

const Label = styled.Text`
  font-size: 12px;
  color: #6B7280;
  margin-bottom: 2px;
  text-transform: uppercase;
  font-weight: 600;
`;

const Value = styled.Text`
  font-size: 15px;
  color: #1F2937;
  line-height: 22px;
`;

const TagContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
`;

const Tag = styled.View`
  background-color: #EEF2FF;
  padding: 6px 12px;
  border-radius: 16px;
  border: 1px solid #E0E7FF;
`;

const TagText = styled.Text`
  color: #4F46E5;
  font-size: 13px;
  font-weight: 500;
`;

const Divider = styled.View`
  height: 1px;
  background-color: #E5E7EB;
  margin-vertical: 12px;
`;

const NoteText = styled.Text`
  font-size: 14px;
  color: #4B5563;
  line-height: 20px;
  font-style: italic;
  background-color: #FFFBEB;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #FEF3C7;
`;

const SeatmapImage = styled(Image)`
  width: 100%;
  height: 240px;
  border-radius: 8px;
  background-color: #F3F4F6;
`;

const Footer = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  padding: 16px 20px;
  padding-bottom: ${Platform.OS === "ios" ? "34px" : "16px"};
  border-top-width: 1px;
  border-top-color: #E5E7EB;
  shadow-color: #000;
  shadow-offset: 0px -2px;
  shadow-opacity: 0.05;
  shadow-radius: 4px;
  elevation: 4;
`;

const BuyButton = styled.TouchableOpacity`
  background-color: #2563EB;
  padding-vertical: 14px;
  border-radius: 8px;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  gap: 8px;
`;

const BuyButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 700;
`;

const CenterContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ErrorText = styled.Text`
  color: #EF4444;
  font-size: 16px;
  text-align: center;
`;

// --- Helper Functions ---

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  } catch {
    return dateStr;
  }
};

const formatTime = (timeStr?: string) => {
  if (!timeStr) return "";
  try {
    const [hours, minutes] = timeStr.split(":");
    return `${hours}:${minutes}`;
  } catch {
    return timeStr;
  }
};

export default function EventDetailPage() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = params.id ?? "";

  const { data, isLoading, isError } = useEventQuery<EventRoot>(id, undefined, {
    enabled: !!id,
  });

  const handleShare = async () => {
    if (!data) return;
    try {
      await Share.share({
        message: `Check out ${data.name} on Ticketmaster! ${data.url}`,
        url: data.url,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleBuyTickets = async () => {
    if (data?.url) {
      if (Platform.OS === "web") {
        window.open(data.url, "_blank");
      } else {
        await WebBrowser.openBrowserAsync(data.url);
      }
    }
  };

  if (!id) {
    return (
      <CenterContainer>
        <ErrorText>{t("common.missingEventId")}</ErrorText>
      </CenterContainer>
    );
  }

  if (isLoading) {
    return (
      <CenterContainer>
        <ActivityIndicator size="large" color="#2563EB" />
      </CenterContainer>
    );
  }

  if (isError || !data) {
    return (
      <CenterContainer>
        <ErrorText>{t("common.errorLoadingEventDetails")}</ErrorText>
      </CenterContainer>
    );
  }

  // Data Extraction
  const poster =
    data.images?.find((img) => img.ratio === "16_9" && img.width > 600) ??
    data.images?.[0];
  
  const venue = data._embedded?.venues?.[0];
  const date = data.dates?.start?.localDate;
  const time = data.dates?.start?.localTime;
  const status = data.dates?.status?.code;
  
  const classification = data.classifications?.[0];
  const tags = [
    classification?.segment?.name,
    classification?.genre?.name,
    classification?.subGenre?.name,
  ].filter(Boolean);

  const attractions = data._embedded?.attractions ?? [];
  const salesPublic = data.sales?.public;
  const presales = data.sales?.presales ?? [];
  const priceRanges = (data as any).priceRanges; // Type definition might be missing this common field
  const promoter = data.promoter?.name;

  return (
    <Container>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerTransparent: true,
          headerTintColor: "white",
          headerRight: () => (
            <Ionicons
              name="share-outline"
              size={24}
              color="white"
              onPress={handleShare}
              style={{ marginRight: 16 }}
            />
          ),
        }}
      />

      <ScrollContent>
        {/* Hero Section */}
        <HeroContainer>
          {poster && (
            <HeroImage source={{ uri: poster.url }} contentFit="cover" />
          )}
          <HeroOverlay>
            {status && status !== "onsale" && (
              <StatusBadge status={status}>
                <StatusText>{status}</StatusText>
              </StatusBadge>
            )}
            <EventTitle numberOfLines={2}>{data.name}</EventTitle>
            <EventSubtitle>
              {venue?.city?.name}, {venue?.country?.name}
            </EventSubtitle>
          </HeroOverlay>
        </HeroContainer>

        <SectionContainer>
          {/* Main Info Card */}
          <Card>
            <InfoRow>
              <Ionicons name="calendar-outline" size={24} color="#2563EB" />
              <InfoContent>
                <Label>{t("event.dateTime")}</Label>
                <Value>{formatDate(date)}</Value>
                {time && <Value>{formatTime(time)}</Value>}
              </InfoContent>
            </InfoRow>

            <Divider />

            <InfoRow>
              <Ionicons name="location-outline" size={24} color="#2563EB" />
              <InfoContent>
                <Label>{t("event.venue")}</Label>
                <Value style={{ fontWeight: "600" }}>{venue?.name}</Value>
                <Value>
                  {[venue?.address?.line1, venue?.city?.name, venue?.state?.name]
                    .filter(Boolean)
                    .join(", ")}
                </Value>
              </InfoContent>
            </InfoRow>

            {tags.length > 0 && (
              <>
                <Divider />
                <TagContainer>
                  {tags.map((tag, index) => (
                    <Tag key={index}>
                      <TagText>{tag}</TagText>
                    </Tag>
                  ))}
                </TagContainer>
              </>
            )}
          </Card>

          {/* Lineup / Attractions */}
          {attractions.length > 0 && (
            <Card>
              <SectionHeader>
                <Ionicons name="people-outline" size={20} color="#111827" />
                <SectionTitle>{t("event.lineup")}</SectionTitle>
              </SectionHeader>
              {attractions.map((attraction, index) => (
                <React.Fragment key={attraction.id}>
                  <InfoRow style={{ marginBottom: 8 }}>
                    <Image
                      source={{ uri: attraction.images?.[0]?.url }}
                      style={{ width: 40, height: 40, borderRadius: 20 }}
                    />
                    <InfoContent style={{ justifyContent: "center" }}>
                      <Value style={{ fontWeight: "600" }}>
                        {attraction.name}
                      </Value>
                    </InfoContent>
                  </InfoRow>
                  {index < attractions.length - 1 && (
                    <Divider style={{ marginVertical: 8 }} />
                  )}
                </React.Fragment>
              ))}
            </Card>
          )}

          {/* Ticket & Sales Info */}
          <Card>
            <SectionHeader>
              <Ionicons name="ticket-outline" size={20} color="#111827" />
              <SectionTitle>{t("event.ticketInfo")}</SectionTitle>
            </SectionHeader>

            {priceRanges?.length > 0 && (
              <InfoRow>
                <InfoContent>
                  <Label>{t("event.priceRange")}</Label>
                  {priceRanges.map((range: any, idx: number) => (
                    <Value key={idx}>
                      {range.min} - {range.max} {range.currency}
                    </Value>
                  ))}
                </InfoContent>
              </InfoRow>
            )}

            {salesPublic && (
              <InfoRow>
                <InfoContent>
                  <Label>{t("event.publicSaleTime")}</Label>
                  <Value>
                    {new Date(salesPublic.startDateTime).toLocaleString()}
                  </Value>
                </InfoContent>
              </InfoRow>
            )}

            {presales.length > 0 && (
              <>
                <Label>{t("event.presaleEvents")}</Label>
                {presales.map((pre, idx) => (
                  <Value key={idx} style={{ fontSize: 13, marginBottom: 4 }}>
                    • {pre.name}: {new Date(pre.startDateTime).toLocaleDateString()}
                  </Value>
                ))}
              </>
            )}

            {data.ticketLimit?.info && (
              <NoteText style={{ marginTop: 8 }}>
                {t("event.ticketLimit")}: {data.ticketLimit.info}
              </NoteText>
            )}
          </Card>

          {/* Additional Info */}
          {(data.pleaseNote || data.info || promoter) && (
            <Card>
              <SectionHeader>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="#111827"
                />
                <SectionTitle>{t("event.additionalInfo")}</SectionTitle>
              </SectionHeader>

              {promoter && (
                <InfoRow>
                  <InfoContent>
                    <Label>{t("event.promoter")}</Label>
                    <Value>{promoter}</Value>
                  </InfoContent>
                </InfoRow>
              )}

              {data.info && (
                <InfoRow>
                  <InfoContent>
                    <Label>{t("event.eventInfo")}</Label>
                    <Value>{data.info}</Value>
                  </InfoContent>
                </InfoRow>
              )}

              {data.pleaseNote && (
                <NoteText>{t("event.pleaseNote")}: {data.pleaseNote}</NoteText>
              )}
            </Card>
          )}

          {/* Seatmap */}
          {data.seatmap?.staticUrl && (
            <Card>
              <SectionHeader>
                <Ionicons name="map-outline" size={20} color="#111827" />
                <SectionTitle>{t("event.seatmap")}</SectionTitle>
              </SectionHeader>
              <SeatmapImage
                source={{ uri: data.seatmap.staticUrl }}
                contentFit="contain"
              />
            </Card>
          )}
        </SectionContainer>
      </ScrollContent>

      {/* Sticky Footer */}
      <Footer>
        <BuyButton onPress={handleBuyTickets} activeOpacity={0.8}>
          <Ionicons name="cart-outline" size={20} color="white" />
          <BuyButtonText>{t("event.buyTickets")}</BuyButtonText>
        </BuyButton>
      </Footer>
    </Container>
  );
}
