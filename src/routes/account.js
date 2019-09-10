const express = require('express');

const router = express();

const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.post('/account', async (req, res) => {
  res.json({ ok: true, user: req.userId });
});

module.exports = router;
