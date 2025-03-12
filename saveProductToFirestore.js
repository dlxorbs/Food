// saveProductToFirestore.js

import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from './firebase'; // firebase.js에서 db를 가져옴

const saveProductToFirestore = async (product) => {
    try {
        // Firestore에서 해당 제품 번호가 이미 있는지 확인
        const productRef = doc(db, "Nendoroid", product.number);
        const docSnap = await getDoc(productRef);

        // 제품이 있으면 업데이트, 없으면 새로 저장
        if (docSnap.exists()) {
            // 존재하면 덮어쓰는 방식으로 업데이트
            await setDoc(productRef, {
                imgsrc: product.image,
                name: product.name,
                number: parseInt(product.number),
                price: product.price
            });

            // console.log(`Product ${product.number} updated.`);
        } else {
            // 없으면 새로 추가
            await setDoc(productRef, {
                imgsrc: product.image,
                name: product.name,
                number: parseInt(product.number),
                price: product.price
            });

            // console.log(`Product ${product.number} saved.`);
        }
    } catch (error) {
        // console.error("Error saving product to Firestore:", error);
    }
};
export { saveProductToFirestore };
