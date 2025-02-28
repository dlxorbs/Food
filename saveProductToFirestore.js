// saveProductToFirestore.js

import { doc, setDoc } from "firebase/firestore";
import { db } from './firebase'; // firebase.js에서 db를 가져옴

const saveProductToFirestore = async (product) => {
    try {
        const productRef = doc(db, "Nendoroid", product.number); // number를 문서 ID로 사용

        await setDoc(productRef, {
            imgsrc: product.image,
            name: product.name,
            number: parseInt(product.number),
            price: product.price
        });

        console.log(`${product.number} 저장됨됨`);
    } catch (error) {
        console.error("Firestore에 데이터 저장 실패:", error);
    }
};

export { saveProductToFirestore };
