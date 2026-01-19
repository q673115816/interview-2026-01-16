import React from "react";
import { Link } from "expo-router";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "@/store";
import { Image } from "expo-image";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding-horizontal: 16px;
`;

const Content = styled.View`
  align-items: center;
  gap: 16px;
`;

const IconImage = styled(Image)`
  width: 64px;
  height: 64px;
  border-radius: 12px;
`;

const Title = styled.Text`
  font-size: 24px;
  text-align: center;
  font-weight: 700;
`;

const Subtitle = styled.Text`
  font-size: 16px;
  text-align: center;
  color: #6B7280;
  margin-top: 4px;
  margin-bottom: 12px;
`;

const ButtonContainer = styled.View`
  margin-top: 8px;
`;

const StyledButton = styled.TouchableOpacity`
  height: 40px;
  padding-horizontal: 16px;
  border-radius: 8px;
  background-color: #111827;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: #F9FAFB;
`;

if (process.env.NODE_ENV === "production") {
  console.log("EXPO_PUBLIC_SUPABASE_URL", process.env.EXPO_PUBLIC_SUPABASE_URL);
}

export default function Page() {
  const { items, addItem } = useStore(
    useShallow(({ addItem, items }) => ({
      items,
      addItem,
    })),
  );

  return (
    <Container>
      <Content>
        <IconImage source={require("@/../icon.png")} />
        <Title role="heading">Ticketmaster 活动浏览</Title>
        <Subtitle>
          在列表页中浏览活动，并进入详情页查看详细信息。
        </Subtitle>

        <ButtonContainer>
          <Link href="/events" asChild>
            <StyledButton>
              <ButtonText>查看活动列表</ButtonText>
            </StyledButton>
          </Link>
        </ButtonContainer>
      </Content>
    </Container>
  );
}
