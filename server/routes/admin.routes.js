const express = require('express');
const router = express.Router();
const mockProducts = require('../data/mockProducts');

router.get('/products', (req, res) => {
  res.json({ success: true, data: mockProducts });
});

router.post('/products', (req, res) => {
  const newProduct = {
    id: mockProducts.length + 1,
    ...req.body
  };

  mockProducts.push(newProduct);

  res.json({ success: true, message: '商品新增成功', data: newProduct });
});

module.exports = router;