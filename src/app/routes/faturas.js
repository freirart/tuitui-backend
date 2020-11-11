const express = require('express');

const router = express.Router();

const authMiddleware = require('../auth');

// const faturasController = require('../controllers/faturas');

// router.get('/page/:pageNumber', faturasController.fetchAll);

router.use(authMiddleware);

router.get('/', (req, res, next) => {
  res.send({ ok: true, userId: req.userId });
});

module.exports = router;