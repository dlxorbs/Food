import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import MyCalender from "./components/Calendar/Calender.jsx";

export default function App() {
  return (
    <View style={styles.container}>
      {/* <StatusBar style="auto" /> */}
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
    overflow: " hidden",
  },
});
