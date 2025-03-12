import { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from "react-native";
import Filter from "../components/BottomSheet/Filter";
import { saveProductToFirestore } from '../saveProductToFirestore'; // Firestore 저장 함수 import
import { getProductsFromFirestore } from '../getProductsFromFirestore'; // Firestore에서 제품을 가져오는 함수 import
import { checkIfProductExists } from '../functions/checkIfProductExists';
import { updateProductInFirestore } from '../functions/updateProductInFirestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [minPrice, setMinPrice] = useState(0); // 최소 가격
  const [maxPrice, setMaxPrice] = useState(5000); // 최대 가격

  // 특수 기호를 기준으로 문자열을 자르는 함수
  const sanitizeName = (name) => {
    const specialCharRegex = /[,\[\(]/; // , [ (
    const sanitized = name.split(specialCharRegex)[0].trim(); // 첫 번째 특수 기호 앞까지 자르기
    return sanitized;
  };

  // 로컬 스토리지에 데이터 저장
  const saveDataToLocalStorage = async (data) => {
    try {
      await AsyncStorage.setItem('productList', JSON.stringify(data));
      console.log('데이터가 로컬 스토리지에 저장되었습니다.');
    } catch (error) {
      console.error('로컬 스토리지에 저장 실패:', error);
    }
  };

  const getDataFromLocalStorage = async () => {
    try {
      const data = await AsyncStorage.getItem('productList');
      return data != null ? JSON.parse(data) : []; // 데이터가 있으면 파싱해서 반환, 없으면 빈 배열 반환
    } catch (error) {
      console.error('로컬 스토리지에서 데이터 가져오기 실패:', error);
      return [];
    }
  };


  const fetchAndSaveCrawledData = async () => {
    setLoading(true);
    setError(null);

    try {
      let offset = 0;
      const productList = [];

      // Firestore에서 기존 제품 데이터 가져오기
      const existingProducts = await getProductsFromFirestore();
      const existingProductNumbers = new Set(existingProducts.map(product => product.number)); // 기존 제품 번호들

      // 2400개의 데이터를 가져오기 위한 반복
      while (offset <= 2460) {
        console.log(`Moving to next batch with offset: ${offset}`);

        const url = `https://www.goodsmile.com/en/search/list?filter=%7B%22search_keyword%22%3A%22%22%2C%22search_over18%22%3Afalse%2C%22search_category%22%3A%5B15%2C15%5D%2C%22search_maker%22%3A%5B%5D%2C%22search_title%22%3A%5B%5D%2C%22search_status%22%3A%220%22%2C%22release_date_from%22%3A%22%22%2C%22release_date_to%22%3A%22%22%2C%22search_bonus%22%3Afalse%2C%22search_exclusive%22%3Afalse%2C%22search_sale%22%3Afalse%2C%22search_sales_origin%22%3Afalse%2C%22tag%22%3A%5B%5D%7D&orderBy=1&limit=60&offset=${offset}&couponId=null&searchIndex=-1`;

        const response = await fetch(url);
        const html = await response.text(); // HTML 가져오기
        console.log(`Fetched HTML for offset ${offset}`);

        // 크롤링한 데이터 처리
        const productRegex = /<figure class="b-product-item__image">.*?<img src="([^"]+)"[^>]*>.*?<figcaption class="b-product-item__image__caption">([^<]+)<\/figcaption>.*?<h2 class="c-title c-title--level8">([^<]+)<\/h2>.*?<span class="c-price__main">([^<]+)<\/span>/gs;

        let match;
        while ((match = productRegex.exec(html)) !== null) {
          const imageUrl = `https://www.goodsmile.com${match[1].trim()}`;
          const productNumber = match[2].trim();
          const sanitizedProductName = match[3].trim();
          const productPrice = match[4].trim();

          // 이미 존재하는 제품인지 확인
          if (existingProductNumbers.has(productNumber)) {
            console.log(`제품 ${productNumber}은 이미 Firestore에 존재합니다.`);
          } else {
            // 새로운 제품만 Firestore에 저장
            const product = {
              name: sanitizedProductName,
              number: productNumber,
              image: imageUrl,
              price: productPrice
            };

            await saveProductToFirestore(product); // 새로운 데이터만 저장
            productList.push(product); // 화면에 표시할 데이터
            existingProductNumbers.add(productNumber); // 새로운 제품 번호를 추가
            console.log(`새로운 제품 ${productNumber} 저장됨`);
          }
        }

        offset += 60; // 다음 배치로 넘어감
      }

      // 모든 데이터 크롤링이 끝난 후 최신 데이터로 상태 업데이트
      await saveDataToLocalStorage(productList); // 로컬 스토리지에 최신 데이터 저장
      const firestoreData = await getProductsFromFirestore();
      const sortedData = firestoreData.sort((a, b) => b.number - a.number); // 번호 기준 내림차순 정렬
      setProducts(sortedData);

    } catch (error) {
      setError("데이터 로딩 실패");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 화면이 처음 렌더링될 때 Firestore에서 데이터를 가져오는 useEffect
  useEffect(() => {
    const fetchData = async () => {
      // 먼저 로컬 스토리지에서 데이터 가져오기
      const localData = await getDataFromLocalStorage();
      if (localData.length > 0) {
        setProducts(localData); // 로컬 데이터가 있으면 그것으로 화면 업데이트
      } else {
        // 로컬 스토리지에 데이터가 없으면 Firestore에서 데이터 가져오기
        const firestoreData = await getProductsFromFirestore();
        // Firestore에서 가져온 데이터를 로컬 스토리지에 저장
        await saveDataToLocalStorage(firestoreData);
        setProducts(firestoreData); // Firestore 데이터로 화면 업데이트
      }
    };

    fetchData();
  }, []); // 컴포넌트가 처음 마운트될 때만 실행

  //  바텀시트 실행
  const bottomSheetModalRef = useRef(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present(); // 모달 열기
  }, []);

  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
    if (index === -1) {
      setModalVisible(false); // 모달이 닫혔을 때
    }
  }, [setModalVisible]);

  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      <TouchableOpacity style={styles.filterButton} onPress={fetchAndSaveCrawledData}>
        <Text style={styles.filterButtonText}>Refresh</Text>
      </TouchableOpacity>


      {loading ? (
        <Text style={{ flex: 1 }}>Loading...</Text>
      ) : error ? (
        <Text style={{ color: 'red' }}>{error}</Text>
      ) : (
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <View style={styles.ImageWrapper}>
                <Text style={styles.productNumber}>{item.number}</Text>
                <Image source={{ uri: item.imgsrc }} style={styles.productImage} />
              </View>
              <View style={styles.productCardContainer}>
                <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">{item.name}</Text>
                <Text style={styles.productPrice}>{item.price}</Text>
              </View>
            </View>
          )}
        />
      )}

      {/* "가격 필터" 버튼 클릭 시 BottomSheet 열기 */}

      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          {/* 버튼을 클릭하면 BottomSheetModal이 열립니다. */}
          <TouchableOpacity style={styles.filterButton} onPress={handlePresentModalPress}>
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>

          {/* BottomSheetModal 설정 */}
          <BottomSheetModal
            ref={bottomSheetModalRef}
            onChange={handleSheetChanges} // 상태 변경 시 콜백
            snapPoints={['25%', '50%', '90%']} // BottomSheet 높이 설정
          >
            <BottomSheetView style={styles.contentContainer}>
              {/* BottomSheet 안에 표시될 내용 */}
              <Text>필터가 적용된 화면입니다 🎉</Text>
            </BottomSheetView>
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>

    </View>
  );
};

const styles = StyleSheet.create({

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
  container: {
    // position: 'absolute',
    zIndex: 999,
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  ImageWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: '1/1',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    overflow: 'hidden'
  },
  productImage: {
    width: '100%',
    aspectRatio: '1/1',
  },
  productCardContainer: {
    padding: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productNumber: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    zIndex: 10
  },
  productPrice: {
    fontSize: 12,
    color: '#00B16A',
    marginTop: 5,
  },
});

export default HomeScreen;
