
const express = require('express');

const router = express.Router();

// Base route: /users

router.get('/:id', (req, res) => {
  res.send({ msg: 'TODO' });
});

router.post('/register', (req, res) => {
  res.send({ msg: 'TODO' });
});

router.post('/login', (req, res) => {
  res.send({ msg: 'TODO' });
});

module.exports = router;
