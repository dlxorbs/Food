import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import Slider from '@react-native-community/slider'; // 기본 Slider 임포트

const { height } = Dimensions.get('window');

const Filter = ({
    modalVisible,
    setModalVisible,
    title,
}) => {
    const [priceRange, setPriceRange] = useState({ low: 0, high: 5000 }); // 슬라이더의 기본값 (최소 0, 최대 5000)
    const [category, setCategory] = useState(''); // 카테고리 입력 필드

    // BottomSheet의 초기 위치 설정
    const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

    return (
        <BottomSheet
            index={0}
            snapPoints={snapPoints}
            onChange={(index) => {
                if (index === -1) {
                    setModalVisible(false);
                }
            }}
            enablePanDownToClose={true}
        >
            <View style={styles.container}>
                <Text style={styles.title}>{title}</Text>

                {/* 가격 범위 슬라이더 */}
                <Text>가격 범위: {priceRange.low} ~ {priceRange.high}</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={5000}
                    step={100}
                    value={priceRange.low}
                    onValueChange={(value) => setPriceRange({ ...priceRange, low: value })}
                    minimumTrackTintColor="#1fb28a"
                    maximumTrackTintColor="#d3d3d3"
                    thumbTintColor="#1e663c"
                />
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={5000}
                    step={100}
                    value={priceRange.high}
                    onValueChange={(value) => setPriceRange({ ...priceRange, high: value })}
                    minimumTrackTintColor="#1fb28a"
                    maximumTrackTintColor="#d3d3d3"
                    thumbTintColor="#1e663c"
                />

                {/* 카테고리 필터 */}
                <Text>카테고리</Text>
                <TextInput
                    style={styles.input}
                    placeholder="카테고리 입력"
                    value={category}
                    onChangeText={setCategory}
                />
            </View>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 20,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    slider: {
        width: '100%',
        height: 40,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
});

export default Filter;
