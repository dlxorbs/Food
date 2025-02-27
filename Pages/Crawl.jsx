import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  FlatList,
  TextInput
} from "react-native";
import Filter from "../components/BottomSheet/Filter";

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFigureType, setSelectedFigureType] = useState('');  // 필터 선택값을 저장하는 상태
  const [searchQuery, setSearchQuery] = useState('');  // 검색어를 저장하는 상태

  const pickerItems = [
    { label: "피규어타입", value: '' },
    { label: "넨도로이드", value: "넨도로이드" },
    { label: "룩업", value: "룩업" }
  ];

  const fetchCrawledData = async () => {

    if (!selectedFigureType) {
      setError('필터를 선택해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // q 파라미터에 필터값(selectedFigureType)을 추가하여 API 요청
      const url = `https://api.bunjang.co.kr/api/1/find_v2.json?q=${searchQuery} ${selectedFigureType}&order=score&page=0&request_id=2025227001207&stat_device=w&n=100&stat_category_required=1&req_ref=search&version=5`;
      const response = await fetch(url);

      const data = await response.json();

      if (data.result === "success" && data.list) {
        const productNames = data.list.map(item => item.name); // 각 상품의 name만 추출
        setProducts(productNames);  // 상품 이름만 상태에 저장
      } else {
        setError('No products found');
      }
    } catch (error) {
      setError('데이터 로딩 실패');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        style={styles.searchInput}
        placeholder="피규어 이름 검색"
        value={searchQuery}
        onChangeText={setSearchQuery} // 입력값을 상태로 저장
        onSubmitEditing={fetchCrawledData} // 엔터를 눌렀을 때 검색 실행
      />
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.filterButtonText}>필터</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={fetchCrawledData}  // 조회 버튼을 눌렀을 때 필터링된 데이터 가져오기
      >
        <Text style={styles.filterButtonText}>조회</Text>
      </TouchableOpacity>

      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text style={{ color: 'red' }}>{error}</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer} // 여기에 paddingBottom 추가
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <Text style={styles.productName}>{item}</Text>  {/* 상품 이름만 출력 */}
            </View>
          )}
        />
      )}
      {/* Filter 컴포넌트 */}
      <Filter
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        pickerItems={pickerItems}
        title="피규어 타입 선택"
        selectedValue={selectedFigureType}  // 선택된 값 전달
        setSelectedValue={setSelectedFigureType}  // 값 변경 함수 전달
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
  },
  filterButton: {
    width: "100%", // 버튼의 너비를 100%로 설정
    backgroundColor: "#5E96EA", // 배경 색상 설정
    paddingVertical: 12, // 버튼 높이 설정
    borderRadius: 5, // 모서리 둥글게 만들기
    alignItems: "center", // 텍스트 가운데 정렬
    justifyContent: "center", // 텍스트 가운데 정렬
    marginBottom: 20, // 아래쪽 여백 추가
  },
  filterButtonText: {
    color: "white", // 글자 색상
    fontSize: 16, // 글자 크기
    fontWeight: "bold", // 글자 두껍게
  },
  listContainer: {
    // 바텀 내비게이션이 가려지지 않도록 여백 추가
  },
  productCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default HomeScreen;
