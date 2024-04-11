import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import MyCalender from "./components/Calendar/Calender.jsx";
import * as Font from "expo-font";

export default function App() {
  const [isFontLoaded, setIsFontLoaded] = useState(false);

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        Tossface: require("./assets/fonts/TossFaceFontWeb.otf"),
        SpoqaThin: require("./assets/fonts/SpoqaHanSansNeo-Thin.otf"),
        SpoqaLight: require("./assets/fonts/SpoqaHanSansNeo-Light.otf"),
        SpoqaMedium: require("./assets/fonts/SpoqaHanSansNeo-Medium.otf"),
        SpoqaRegular: require("./assets/fonts/SpoqaHanSansNeo-Regular.otf"),
        SpoqaBold: require("./assets/fonts/SpoqaHanSansNeo-Bold.otf"),
      });
      setIsFontLoaded(true);
    }

    loadFont();
  }, []);

  if (!isFontLoaded) {
    // 폰트가 로드되지 않았을 때 로딩 화면을 보여줄 수 있습니다.
    return null;
  }

  return (
    <View style={styles.container}>
      <MyCalender />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    marginTop: 54,
    marginLeft: 20,
    marginRight: 20,
    margin: "auto",
    borderRadius: 4,
    overflow: "hidden",
  },
});
