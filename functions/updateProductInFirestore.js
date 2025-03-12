// updateProductInFirestore.js
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../firebase'; // firebase.js에서 db를 가져옴

const updateProductInFirestore = async (product) => {
    try {
        const productRef = doc(db, "Nendoroid", product.number);

        await updateDoc(productRef, {
            name: product.name,
            imgsrc: product.image,
            price: product.price
        });

        console.log(`${product.number} 업데이트됨`);
    } catch (error) {
        console.error("Firestore에서 제품 업데이트 실패:", error);
    }
};

export { updateProductInFirestore };
