import React, { useState, useEffect, useRef } from "react";
import { Calendar, LocaleConfig } from "react-native-calendars";
import BottomSheet from "./BottomSheet";
import {
  TouchableOpacity,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Modal,
  Button,
  Animated,
} from "react-native";
import datas from "../../assets/data/data.json";

LocaleConfig.locales["ko"] = {
  monthNames: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  monthNamesShort: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  dayNames: [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ],
  dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
};

LocaleConfig.defaultLocale = "ko";
const Schedule = (props) => {
  return (
    <View style={styles.ScheduleContainer}>
 <View style={styles.HeaderInfo}>
      <View style={[
                styles.nutrition,
                {display: props.nendoroidvisibility},
                styles.nendoroid,
              ]}
            />
            <View
              style={[
                styles.nutrition,
                styles.lookup,
                {display: props.lookupvisibility},
              ]}
            />
            <View
              style={[
                styles.nutrition, 
                styles.etc,
                {display: props.etcvisibility},
              ]}
            />
      </View>
<View style={{flex : 1}}>
<View style={styles.nutritionInfo}>
        <View style={[styles.box, styles.nendoroid]}></View>
        <Text style={styles.nutritionText}>넨도로이드</Text>
      </View>
      <View style={styles.nutritionInfo}>
        <View style={[styles.box, styles.lookup]}></View>
        <Text style={styles.nutritionText}>룩업</Text>
      </View>
      <View style={styles.nutritionInfo}>
        <View style={[styles.box, styles.etc]}></View>
        <Text style={styles.nutritionText}>기타</Text>
      </View>
</View>
    </View>
  );
};

const MyCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [nutrition, setNutrition] = useState("");
  const [data, setData] = useState(datas);

  console.log(nutrition);
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Calendar
        theme={{
          backgroundColor: "#ffffff",
          calendarBackground: "#ffffff",
          textSectionTitleColor: "#b6c1cd",
          selectedDayBackgroundColor: "#00adf5",
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#00adf5",
          dayTextColor: "#2d4150",
          textDisabledColor: "#d9e1e8",
          dotColor: "#00adf5",
          selectedDotColor: "#ffffff",
          arrowColor: "#5E96EA",
          disabledArrowColor: "#d9e1e8",
          monthTextColor: "#333333",
          indicatorColor: "#333333",
          textDayFontWeight: "300",
          textMonthFontWeight: "bold",
          textDayHeaderFontWeight: "300",
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16,
        }}
        headerStyle={{
          display: "flex",
          justifyContent: "center",
        }}
        headerContainer={{
          backgroundColor: "#333333",
        }}
        // state는 상태를 나타내는 정보 오늘, disabled , date는 날짜
        dayComponent={({ date, state }) => {
          // 해당 날짜의 데이터를 찾기 위해 find 메서드 사용
          const daydate = data.result || [];

          const selectedDateData = daydate.find(
            (item) => item.date === date.dateString
          );
          console.log(daydate);
          return (
            <TouchableOpacity
              onPress={() => {
                setSelectedDate(date.dateString);
                setModalVisible(true);
                setNutrition(daydate);
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "spacebetween",
                  width: 50,
                  height: 100,
                  paddingRight: 4,
                  paddingLeft: 4,
                }}
              >
                <View
                  style={{
                    borderRadius: 999,
                    width: 24,
                    height: 24,
                    alignItems: "center",
                    backgroundColor:
                      state === "today" ? "#CEE6EB" : "transparent",
                    marginBottom: 8,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: state === "disabled" ? "#999999" : "#333333",
                      flex: 1,
                      height: 16,
                      marginTop: 3,
                    }}
                  >
                    {date.day}
                  </Text>
                </View>

                <Schedule
                  nendoroidvisibility={
                    selectedDateData?.nendoroid ? 'block': 'none'
                  }
                  lookupvisibility={
                    selectedDateData?.lookup ? 'block': 'none'
                  }
                  etcvisibility={selectedDateData?.etc ? 'block': 'none'}
                />
              </View>
            </TouchableOpacity>
          );
        }}
      />
      <BottomSheet
        selectedDate={selectedDate}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  centeredView: {
    flex: 1,
    alignContent: "center",
    textAlignVertical: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "#ffffff", // 배경색
    paddingHorizontal: 20, // 좌우 padding
    paddingVertical: 10, // 상하 padding
    width: "100%",
  },
  ScheduleContainer: {
    flex: 1,
    maxHeight: 48,
    alignItems: "center",
    justifyContent: "space-between", // 수평 방향 정렬
    alignItems: "left",
    gap: 4,
  },
  nutrition: {
    width:10,
    height: 10,
    flexDirection: "column",
    borderRadius: 999,
  },
 HeaderInfo: {
    flex: 1,
    maxHeight: 10,
    justifyContent:"center",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  nutritionInfo: {
    flex: 1,
    height: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  nutritionText: {
    fontSize: 8,
  },

  box: { width: 6, height: 6, borderRadius:2 },

  nendoroid: {
    backgroundColor: "#5E96EA",
  },
  lookup: {
    backgroundColor: "#FCD967",
  },
  etc: {
    backgroundColor: "#FECCCD",
  },
});

export default MyCalendar;
