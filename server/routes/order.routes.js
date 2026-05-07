const express = require('express');
const router = express.Router();

let orders = [];

router.post('/', (req, res) => {
  const order = {
    id: orders.length + 1,
    ...req.body,
    paymentStatus: 'PENDING',
    orderStatus: 'PENDING',
    createdAt: new Date()
  };

  orders.push(order);

  res.json({ success: true, message: '訂單建立成功', data: order });
});

router.get('/my', (req, res) => {
  res.json({ success: true, data: orders });
});

module.exports = router;