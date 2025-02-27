import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Image,
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
    setLoading(true);
    setError(null);

    try {
      const url = `https://www.goodsmile.com/en/search/list?filter=%7B%22search_keyword%22%3A%22%22%2C%22search_over18%22%3Afalse%2C%22search_category%22%3A%5B15%2C15%5D%2C%22search_maker%22%3A%5B%5D%2C%22search_title%22%3A%5B%5D%2C%22search_status%22%3A%220%22%2C%22release_date_from%22%3A%22%22%2C%22release_date_to%22%3A%22%22%2C%22search_bonus%22%3Afalse%2C%22search_exclusive%22%3Afalse%2C%22search_sale%22%3Afalse%2C%22search_sales_origin%22%3Afalse%2C%22tag%22%3A%5B%5D%7D&orderBy=1&limit=60&offset=0&couponId=null&searchIndex=-1`;
      const response = await fetch(url);
      const html = await response.text(); // HTML로 받기

      // 정규식으로 데이터 추출
      const nameRegex = /<h2 class="c-title c-title--level8">([^<]+)<\/h2>/g;
      const priceRegex = /<span class="c-price__main">([^<]+)<\/span>/g;
      const imgRegex = /<figure class="b-product-item__image">.*?<picture class="c-image is-loaded">.*?<img src="([^"]+)"/g;
      const numberRegex = /<figcaption class="b-product-item__image__caption">([^<]+)<\/figcaption>/g;


      let match;
      let productList = [];

      while ((match = nameRegex.exec(html)) !== null) {
        const priceMatch = priceRegex.exec(html);
        const imgMatch = imgRegex.exec(html);
        const numberMatch = numberRegex.exec(html);

        // 이미지 URL 처리
        const imageUrl = imgMatch ? `https://www.goodsmile.com${imgMatch[1]}` : "N/A"; // 제대로 URL 처리

        productList.push({
          name: match[1].trim(),
          price: priceMatch ? priceMatch[1].trim() : "N/A",
          image: imageUrl,
          number: numberMatch ? numberMatch[1].trim() : "N/A",
        });
      }

      if (productList.length > 0) {
        setProducts(productList); // 추출한 상품 리스트 저장
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
    <View style={{ flex: 1, marginTop: 20 }}>
      <TextInput
        style={styles.searchInput}
        placeholder="피규어 이름 검색"
        value={searchQuery}
        onChangeText={setSearchQuery} // 입력값을 상태로 저장
        onSubmitEditing={fetchCrawledData} // 엔터를 눌렀을 때 검색 실행
      />
      {/* <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.filterButtonText}>필터</Text>
      </TouchableOpacity> */}
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
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer} // 여기에 paddingBottom 추가
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <Image source={{ uri: item.image }} style={styles.productImage} /> {/* 상품 이미지 출력 */}
              <View style={styles.productCardContainer}>
                <Text style={styles.productName}>{item.name}</Text>  {/* 상품 이름 출력 */}
                <Text style={styles.productNumber}>{item.number}</Text> {/* 상품 번호 출력 */}
              </View>
              <Text style={styles.productPrice}>{item.image}</Text>
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
    padding: 10,
    margin: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: "#5E96EA",
    paddingVertical: 12,
    marginHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  filterButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  listContainer: {
    paddingBottom: 20,
    marginRight: 20,
    marginLeft: 20
  },
  productCard: {
    flex: 1,  // 각 카드가 2열로 나누어질 수 있게 flex로 설정
    margin: 4,  // 카드 간격을 8px (양옆 4px씩)
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,  // 안드로이드에서 그림자 효과
  },
  productImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  productCardContainer: {
    padding: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productNumber: {
    fontSize: 14,
    color: '#777',
  },
  productPrice: {
    fontSize: 16,
    color: '#00B16A',
    marginTop: 5,
  },
});

export default HomeScreen;
