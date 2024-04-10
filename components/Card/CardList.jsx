import React, { useState, useRef, useEffect } from "react";
import {
  View,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
} from "react-native";
import styled from "styled-components/native";
import Card from "./Card";

const Container = styled.View`
  gap: 12px;
`;

const CardContainer = styled(Animated.View)`
  width: 231px;
  margin-horizontal: 6px;
`;

const PlaceholderCard = styled.View`
  width: 230px;
  height: 300px;
  margin-horizontal: 10px;
  background-color: #000;
`;

const Cardlist = (props) => {
  const { data } = props;
  const [currentIndex, setCurrentIndex] = useState(1);
  const position = useRef(new Animated.ValueXY()).current;
  const cardWidth = 230;
  const scrollViewRef = useRef(null);

  useEffect(() => {
    // 컴포넌트가 마운트되었을 때 초기 스크롤 위치를 두 번째 카드의 위치로 설정
    scrollViewRef.current.scrollTo({ x: cardWidth / 2, animated: false });
  }, []);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      position.setValue({ x: gestureState.dx, y: 0 });
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else if (gestureState.dx < 0 && currentIndex < data.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
      Animated.spring(position, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start();
    },
  });

  const renderCards = () => {
    return data.map((item, index) => {
      const isMain = index === currentIndex;
      const adjustedIndex = index + 1; // 데이터의 인덱스를 1씩 감소

      if (index === 0) {
        // 첫 번째 카드는 투명한 박스로 대체
        return <PlaceholderCard key={index} cardWidth={cardWidth} />;
      } else {
        return (
          <CardContainer
            key={adjustedIndex}
            cardWidth={cardWidth}
            style={{
              transform: [
                { translateX: Animated.subtract(cardWidth, position.x) },
              ],
            }}
            {...panResponder.panHandlers}
          >
            <Card
              type={isMain ? "main" : ""}
              source={""}
              meal={item.meal}
              food={item.food}
              kcal={item.kcal}
            />
          </CardContainer>
        );
      }
    });
  };

  return (
    <Container>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1, // ScrollView의 내용이 화면 크기보다 클 때 스크롤이 가능하도록 함
        }}
        onScroll={(event) => {
          const newIndex = Math.floor(
            event.nativeEvent.contentOffset.x / cardWidth
          );
          if (newIndex !== currentIndex) {
            setCurrentIndex(newIndex);
          }
        }}
      >
        {renderCards()}
      </ScrollView>
    </Container>
  );
};

export default Cardlist;
