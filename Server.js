const puppeteer = require('puppeteer');
const axios = require('axios');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // API 호출하여 JSON 데이터 받아오기
  const response = await axios.get('https://api.bunjang.co.kr/api/1/find_v2.json?q=%EB%84%A8%EB%8F%84%EB%A1%9C%EC%9D%B4%EB%93%9C&order=score&page=0&request_id=2025227001207&stat_device=w&n=100&stat_category_required=1&req_ref=search&version=5');
  const data = response.data;

  // 상품 이름과 가격 출력
  data.forEach(item => {
    console.log(`상품명: ${item.name}`);
    console.log(`가격: ${item.price}`);
    console.log(`이미지 URL: ${item.product_image}`);
    console.log('-------------------------');
  });

  await browser.close();
})();
