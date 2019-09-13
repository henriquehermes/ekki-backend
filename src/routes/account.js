const express = require('express');

const router = express();

const authMiddleware = require('../middlewares/auth');
const AccountController = require('../controllers/account');


router.use(authMiddleware);

router.get('/:identifier', AccountController.Index);

router.post('/:identifier/transfer', AccountController.Transaction);

module.exports = router;
