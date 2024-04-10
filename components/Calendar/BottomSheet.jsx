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
} from "react-native";
import Cardlist from "../Card/CardList";
import Card from "../Card/Card";
const BottomSheet = (props) => {
  const { modalVisible, setModalVisible } = props;
  const [showOverlay, setShowOverlay] = useState(false); // State to control overlay appearance

  const dummy = [
    { meal: "점심", food: "김치찌개", kcal: "600" },
    { meal: "점심", food: "김치찌개" },
  ];

  useEffect(() => {
    // When modalVisible changes to true, set showOverlay to true after 300ms
    if (modalVisible) {
      const timer = setTimeout(() => {
        setShowOverlay(true);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      // When modalVisible changes to false, reset showOverlay after a short delay
      const timer = setTimeout(() => {
        setShowOverlay(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [modalVisible]);

  const screenHeight = Dimensions.get("screen").height;

  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      presentationStyle={"pageSheet"} //애플이 적용가능 이거 사용시 아래 스크롤 인터랙션 구현
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <Text style={styles.modalTitle}> {props.selectedDate}</Text>
      <ScrollView style={styles.scrollContainer}>
        <Cardlist data={dummy} />
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    // flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  background: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "#ffffff", // 배경색
    paddingHorizontal: 20, // 좌우 padding
    paddingVertical: 10, // 상하 padding
    width: "100%",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    flex: 1,
    marginTop: 20,
    padding: "20 35 35",
    alignItems: "left",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "800",
    padding: 24,
    display: "flex",
  },
  CardList: {
    flex: 1,
    hegith: 600,
  },
});

export default BottomSheet;
