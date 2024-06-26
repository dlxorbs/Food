import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Animated,
  Dimensions,
  TouchableHighlight,
  useWindowDimensions,
} from "react-native";
import styled from "styled-components/native";
import Card from "./Card";
import AddCard from "./AddCard";
import * as Font from "expo-font";
import { theme } from "../Theme";

const Container = styled.View`
  flex: 1;
`;

const PlaceholderCard = styled.View`
  width: 230px;
  height: 300px;
  margin-horizontal: 10px;
  background-color: #000;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: 700;
  font-family: ${theme.fonts.title};
`;
const TitleIcon = styled.Text`
  font-size: 20px;
  font-weight: 700;
  font-family: ${theme.fonts.icon};
`;

const Header = (props) => {
  return (
    <View style={{ flexDirection: "row", marginHorizontal: 20 }}>
      <TitleIcon>{props.Icons || "🍴"}</TitleIcon>
      <Title>{props.Title}</Title>
    </View>
  );
};

const cardWidth = 231;

const Cardlist = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const { height, width } = useWindowDimensions();
  const offset = (width - cardWidth) / 2;

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0]?.index || 0);
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  // AddCard 데이터 생성
  const addCardData = [{ id: "addCard" }];

  // 데이터 배열에 AddCard를 추가
  const updatedData = [...data, ...addCardData];
  console.log(currentIndex);
  return (
    <Container>
      <Header Icons={"🍴"} Title={"식단"} />
      <FlatList
        data={updatedData}
        horizontal
        pagingEnabled // 한 페이지씩 스크롤하도록 설정
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ width: cardWidth, alignItems: "center" }}>
            {item.id === "addCard" ? (
              <AddCard
                type={currentIndex === updatedData.indexOf(item) ? "main" : ""}
              />
            ) : (
              <TouchableHighlight
                activeOpacity={0.6}
                underlayColor="#DDDDDD"
                onPress={() => alert("Pressed!")}
              >
                <Card
                  type={
                    currentIndex === updatedData.indexOf(item) ? "main" : ""
                  }
                  source=""
                  meal={item.meal}
                  food={item.food}
                  kcal={item.kcal}
                />
              </TouchableHighlight>
            )}
          </View>
        )}
        contentContainerStyle={{
          paddingHorizontal: offset + 6,
          gap: 6,
          paddingVertical: 32,
        }}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfigRef.current}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        snapToInterval={cardWidth + 12} // 한 칸씩 스크롤되도록 설정
        decelerationRate="fast"
      />
    </Container>
  );
};

export default Cardlist;
