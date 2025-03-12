import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase'; // firebase.js에서 db를 가져옴

const checkIfProductExists = async (productNumber) => {
    try {
        const productRef = doc(db, "Nendoroid", productNumber);
        const docSnap = await getDoc(productRef);
        // 존재하면 true, 없으면 false 반환
        return docSnap.exists();
    } catch (error) {
        console.error("Firestore에서 제품 확인 실패:", error);
        return false;
    }
};

export { checkIfProductExists };
