const express = require('express');
const router = express.Router();

const mockUser = {
  id: 1,
  name: '品牌會員',
  email: 'demo@shiqinghuayi.com',
  role: 'USER',
  createdAt: new Date('2026-01-10T10:00:00')
};

router.post('/register', (req, res) => {
  const { name, email } = req.body;
  res.json({
    success: true,
    message: '註冊成功',
    data: {
      ...mockUser,
      name: name || mockUser.name,
      email: email || mockUser.email
    }
  });
});

router.post('/login', (req, res) => {
  const { email } = req.body;
  res.json({
    success: true,
    message: '登入成功',
    token: 'mock-jwt-token',
    data: {
      ...mockUser,
      email: email || mockUser.email
    }
  });
});

router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: '未登入' });
  }

  res.json({
    success: true,
    data: mockUser
  });
});

router.get('/google', (req, res) => {
  res.json({ success: true, message: 'Google OAuth 之後接入' });
});

router.get('/facebook', (req, res) => {
  res.json({ success: true, message: 'Facebook OAuth 之後接入' });
});

module.exports = router;
