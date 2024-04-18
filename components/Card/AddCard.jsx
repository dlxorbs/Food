import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, TouchableHighlight } from "react-native";
import { theme } from "../Theme";
import { WithLocalSvg } from "react-native-svg/css";
import plus from "../../assets/images/plus.svg";

const AddCard = (props) => {
  return (
    <View
      style={[styles.cardConatiner, props.type === "main" ? "" : styles.small]}
    >
      <View style={styles.circle}>
        <WithLocalSvg width={36} height={36} asset={plus} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  small: {
    transform: [{ scale: 0.9 }],
  },
  cardConatiner: {
    width: 231,
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
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    width: 72,
    height: 72,
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  plus: {
    // backgroundColor: theme.colors.white,
    fill: theme.colors.white,
  },
});

export default AddCard;
