// server.js (Node.js 서버)
const express = require('express');
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');

const app = express();
const port = 3000;

// 텍스트 크롤링 API
app.get('/fetch-text', async (req, res) => {
  const url = req.query.url;

  try {
    const response = await fetch(url);
    const html = await response.text();

    // 텍스트 크롤링: 상품 이름, 가격 등 추출
    const nameRegex = /<h2 class="c-title c-title--level8">([^<]+)<\/h2>/g;
    const priceRegex = /<span class="c-price__main">([^<]+)<\/span>/g;

    let match;
    let productList = [];
    while ((match = nameRegex.exec(html)) !== null) {
      const priceMatch = priceRegex.exec(html);
      productList.push({
        name: match[1].trim(),
        price: priceMatch ? priceMatch[1].trim() : "N/A",
      });
    }

    if (productList.length > 0) {
      res.json({ products: productList });
    } else {
      res.status(404).json({ error: 'No products found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// 이미지 크롤링 API
app.get('/scrape-images', async (req, res) => {
  const url = req.query.url;

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // 이미지 URL 크롤링
    const imageUrls = await page.evaluate(() => {
      const images = document.querySelectorAll('figure.b-product-item__image img');
      return Array.from(images).map(img => `https://www.goodsmile.com${img.src}`);
    });

    await browser.close();

    if (imageUrls.length > 0) {
      res.json({ imageUrls });
    } else {
      res.status(404).json({ error: 'No images found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching images' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
