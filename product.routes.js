const express = require('express');
const router = express.Router();
const mockProducts = require('../data/mockProducts');

router.get('/', (req, res) => {
  res.json({ success: true, data: mockProducts });
});

router.get('/:slug', (req, res) => {
  const product = mockProducts.find(item => item.slug === req.params.slug);

  if (!product) {
    return res.status(404).json({ success: false, message: '找不到商品' });
  }

  res.json({ success: true, data: product });
});

module.exports = router;
