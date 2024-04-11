import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  Animated,
  Button,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
  PanResponder,
  Image,
} from "react-native";
import { theme } from "../Theme";

const Card = (props) => {
  const imgSrc = {
    uri: "https://velog.velcdn.com/images/eojine94/post/189018d7-fe6e-4d88-afec-c31865a5a8ff/ReactNative.png",
  };
  return (
    <View
      style={[styles.cardConatiner, props.type === "main" ? "" : styles.small]}
    >
      <Image style={styles.foodimage} source={props.source || imgSrc}></Image>
      <Text style={styles.mealInfo}>{props.meal || "meal"}</Text>
      <View style={styles.foodInfo}>
        <Text>{props.food || "food"}</Text>
        <Text>{props.kcal || "kcal"}</Text>
      </View>

      <View style={styles.foodratio}>
        <Text style={{ fontSize: 8 }}> 탄수화물:단백질:지방 </Text>
        <View style={styles.foodratiobar}></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  small: {
    transform: [{ scale: 0.9 }],
  },
  cardConatiner: {
    height: 300,
    backgroundColor: theme.colors.cardback,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  foodimage: {
    width: 231,
    height: 173,
    backgroundColor: "#000000",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },

  carbohydrate: {
    backgroundColor: "#8785D2",
  },
  fat: {
    backgroundColor: "#5E96EA",
  },
  protien: {
    backgroundColor: "#99D1E2",
  },
});

export default Card;
