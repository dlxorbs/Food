// getProductsFromFirestore.js

import { db } from './firebase'; // firebase.js에서 db를 import
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

const getProductsFromFirestore = async () => {
    try {
        const q = query(collection(db, "Nendoroid"), orderBy("number", "desc"));
        const querySnapshot = await getDocs(q);

        const products = querySnapshot.docs.map(doc => doc.data());
        return products;
    } catch (error) {
        console.error("Error getting products from Firestore: ", error);
        throw new Error("데이터를 불러오는 데 실패했습니다.");
    }
};

export { getProductsFromFirestore };