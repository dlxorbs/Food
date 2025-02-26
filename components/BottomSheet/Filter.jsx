import React from "react";
import {
    View,
    Text,
    Modal,
    StyleSheet,
    Animated,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const { height } = Dimensions.get("window");

const Filter = ({ modalVisible, setModalVisible, pickerItems, title, selectedValue, setSelectedValue }) => {
    const [translateY] = React.useState(new Animated.Value(height)); // 바텀시트의 초기 위치 (화면 밖으로 시작)

    // 애니메이션을 통해 바텀 시트를 화면 위로 올리기
    const openBottomSheet = () => {
        Animated.spring(translateY, {
            toValue: 0, // 화면 아래로부터 0만큼 위로
            useNativeDriver: true,
        }).start();
    };

    // 애니메이션을 통해 바텀 시트를 화면 밖으로 내리기
    const closeBottomSheet = () => {
        Animated.spring(translateY, {
            toValue: height, // 화면 아래로 내리기
            useNativeDriver: true,
        }).start(() => setModalVisible(false));
    };

    // 모달이 열릴 때 바텀 시트를 올리도록 설정
    React.useEffect(() => {
        if (modalVisible) {
            openBottomSheet();
        } else {
            closeBottomSheet();
        }
    }, [modalVisible]);

    return (
        <Modal
            animationType="none" // 기본 애니메이션 제거
            visible={modalVisible}
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.overlay}>
                <Animated.View
                    style={[styles.bottomSheet, { transform: [{ translateY }] }]}
                >
                    <View style={styles.content}>
                        <View style={styles.contentWrapper}>
                            <Text style={styles.title}>{title}</Text>
                            {/* 확인 버튼 */}
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>확인</Text>
                            </TouchableOpacity>
                        </View>

                        {/* 피커 컴포넌트 */}
                        <Picker
                            selectedValue={selectedValue}
                            onValueChange={(itemValue) => setSelectedValue(itemValue)}  // 선택된 값 업데이트
                            style={styles.picker}
                        >
                            {pickerItems?.map((item, index) => (
                                <Picker.Item
                                    key={index}
                                    label={item.label}
                                    value={item.value}
                                />
                            ))}
                        </Picker>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // 배경 어두운 색
    },
    bottomSheet: {
        width: "100%",
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 50,
        position: "absolute",
        bottom: 0,
        elevation: 5,
    },
    content: {
        justifyContent: 'space-between',
    },
    contentWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
    },
    picker: {
        width: "100%",
        height: 150,
    },
    button: {
        color: "#007bff",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: "#007bff",
        fontSize: 16,
    },
});

export default Filter;
