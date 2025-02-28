import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from "react-native";
import { saveProductToFirestore } from '../saveProductToFirestore'; // Firestore 저장 함수 import
import { getProductsFromFirestore } from '../getProductsFromFirestore'; // Firestore에서 제품을 가져오는 함수 import

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 특수 기호를 기준으로 문자열을 자르는 함수
  const sanitizeName = (name) => {
    const specialCharRegex = /[,\[\(]/; // , [ (
    const sanitized = name.split(specialCharRegex)[0].trim(); // 첫 번째 특수 기호 앞까지 자르기
    return sanitized;
  };

  // 크롤링하여 데이터를 Firestore에 저장하는 함수
  const fetchAndSaveCrawledData = async () => {
    setLoading(true);
    setError(null);

    try {
      let offset = 0;
      const productList = [];

      // 2400개의 데이터를 가져오기 위한 반복
      while (offset <= 2460) {
        const url = `https://www.goodsmile.com/en/search/list?filter=%7B%22search_keyword%22%3A%22%22%2C%22search_over18%22%3Afalse%2C%22search_category%22%3A%5B15%2C15%5D%2C%22search_maker%22%3A%5B%5D%2C%22search_title%22%3A%5B%5D%2C%22search_status%22%3A%220%22%2C%22release_date_from%22%3A%22%22%2C%22release_date_to%22%3A%22%22%2C%22search_bonus%22%3Afalse%2C%22search_exclusive%22%3Afalse%2C%22search_sale%22%3Afalse%2C%22search_sales_origin%22%3Afalse%2C%22tag%22%3A%5B%5D%7D&orderBy=1&limit=60&offset=${offset}&couponId=null&searchIndex=-1`;

        const response = await fetch(url);
        const html = await response.text(); // HTML 가져오기

        const nameRegex = /<h2 class="c-title c-title--level8">([^<]+)<\/h2>/g;
        const numberRegex = /<figcaption class="b-product-item__image__caption">([^<]+)<\/figcaption>/g;

        let match;

        while ((match = nameRegex.exec(html)) !== null) {
          let productName = match[1].trim();
          const sanitizedProductName = sanitizeName(productName); // 특수 기호 앞까지 자른 이름

          const numberMatch = numberRegex.exec(html);
          const productNumber = numberMatch ? numberMatch[1].trim() : null;

          if (!productNumber) {
            continue; // number가 없으면 저장하지 않음
          }

          // 이미지 찾기
          const imgRegex = new RegExp(`<img src="([^"]+)" alt="${sanitizedProductName}"`, "g");
          const imgMatch = imgRegex.exec(html);
          const imageUrl = imgMatch ? `https://www.goodsmile.com${imgMatch[1]}` : "N/A";

          // 가격 데이터가 없다면 "N/A"로 처리
          const priceRegex = /<span class="c-price__main">([^<]+)<\/span>/g;
          const priceMatch = priceRegex.exec(html);
          const productPrice = priceMatch ? priceMatch[1].trim() : "N/A";

          // 제품 데이터 저장
          const product = {
            name: sanitizedProductName,
            number: productNumber,
            image: imageUrl,
            price: productPrice
          };

          // Firestore에 저장
          await saveProductToFirestore(product);
          productList.push(product); // 화면에 표시할 데이터
        }

        offset += 60; // 다음 배치로 넘어감
      }

      // 크롤링이 끝나면 Firestore에서 데이터를 불러와서 상태 업데이트
      const firestoreData = await getProductsFromFirestore();
      setProducts(firestoreData); // 가져온 데이터로 화면 업데이트

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
      try {
        const firestoreData = await getProductsFromFirestore();
        setProducts(firestoreData); // 가져온 데이터로 화면 업데이트
      } catch (error) {
        setError("데이터를 불러오는 데 실패했습니다.");
      }
    };

    fetchData();
  }, []); // 컴포넌트가 처음 마운트될 때만 실행

  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      <TouchableOpacity style={styles.filterButton} onPress={fetchAndSaveCrawledData}>
        <Text style={styles.filterButtonText}>Refresh</Text>
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
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <View style={styles.ImageWrapper}>
                <Text style={styles.productNumber}>{item.number}</Text>
                <Image source={{ uri: item.imgsrc }} style={styles.productImage} />
              </View>
              <View style={styles.productCardContainer}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price}</Text>
              </View>
            </View>
          )}
        />
      )}
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
