// getProductsFromFirestore.js

import { db } from './firebase'; // firebase.js에서 db를 import
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

export const getProductsFromFirestore = async () => {
    try {
        // Firestore에서 Nendoroid 컬렉션 참조, 'number' 필드를 기준으로 내림차순 정렬
        const q = query(collection(db, "Nendoroid"), orderBy("number", "desc"));

        // 데이터를 가져오기
        const querySnapshot = await getDocs(q);

        // 가져온 데이터를 배열로 변환
        const products = querySnapshot.docs.map(doc => doc.data());

        return products; // 가져온 데이터 반환
    } catch (error) {
        console.error("Error getting products: ", error);
        throw new Error("데이터를 불러오는 데 실패했습니다.");
    }
};
