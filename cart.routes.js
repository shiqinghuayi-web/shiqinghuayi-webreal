const express = require('express');
const router = express.Router();

let cart = [];

router.get('/', (req, res) => {
  res.json({ success: true, data: cart });
});

router.post('/add', (req, res) => {
  const { productId, name, price, quantity, imageUrl } = req.body;

  const existingItem = cart.find(item => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ productId, name, price, quantity, imageUrl });
  }

  res.json({ success: true, message: '商品已加入購物車', data: cart });
});

router.put('/item/:productId', (req, res) => {
  const productId = Number(req.params.productId);
  const { quantity } = req.body;

  cart = cart.map(item =>
    item.productId === productId ? { ...item, quantity } : item
  );

  res.json({ success: true, message: '購物車已更新', data: cart });
});

router.delete('/item/:productId', (req, res) => {
  const productId = Number(req.params.productId);
  cart = cart.filter(item => item.productId !== productId);
  res.json({ success: true, message: '商品已刪除', data: cart });
});

module.exports = router;
