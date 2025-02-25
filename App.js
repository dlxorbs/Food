import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from 'react-native-vector-icons';
import HomeScreen from "./Pages/HomeScreen";
import SettingsScreen from "./Pages/SettingScreen";
import CalendarScreen from "./Pages/CalendarScreen";
import * as Font from "expo-font";

export default function App() {
  const [isFontLoaded, setIsFontLoaded] = useState(false);
  const [pressedTab, setPressedTab] = useState(null);
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
  // 탭 네비게이터 생성
  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer >
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === '홈') iconName = focused ? 'home' : 'home-outline';
            else if (route.name === '설정') iconName = focused ? 'settings' : 'settings-outline';
            else if (route.name === '일정') iconName = focused ? 'calendar' : 'calendar-outline';

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#5E96EA',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            height: 100, // 하단 네비게이션 바의 높이 조정

          },
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPressIn={() => setPressedTab(route.name)}
              onPressOut={() => setPressedTab(null)} // 뗄 때
              style={{
                justifyContent: 'center', alignItems: 'center', flexDirection: "column", gap: 12,
                backgroundColor: pressedTab === route.name ? '#33333310' : 'transparent',
                borderRadius: 0,
                padding: 20,
              }}
            />
          ),
        })}
      >
        <Tab.Screen name="홈" component={HomeScreen} />
        <Tab.Screen name="일정" component={CalendarScreen} />
        <Tab.Screen name="설정" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer >
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
  Navigation: {

  }
});
