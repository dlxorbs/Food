import React, { useState, useRef } from "react";
import { View, FlatList, Animated, Dimensions } from "react-native";
import styled from "styled-components/native";
import Card from "./Card";

const Container = styled.View`
  flex: 1;
`;

const PlaceholderCard = styled.View`
  width: 230px;
  height: 300px;
  margin-horizontal: 10px;
  background-color: #000;
`;

const cardWidth = 231;

const Cardlist = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const offset = 80;

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0]?.index || 0);
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  return (
    <Container>
      <FlatList
        data={data}
        horizontal
        pagingEnabled // 한 페이지씩 스크롤하도록 설정
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ width: cardWidth, alignItems: "center" }}>
            <Card
              type={currentIndex === data.indexOf(item) ? "main" : ""}
              source=""
              meal={item.meal}
              food={item.food}
              kcal={item.kcal}
            />
          </View>
        )}
        contentContainerStyle={{
          paddingHorizontal: offset + 6,
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
