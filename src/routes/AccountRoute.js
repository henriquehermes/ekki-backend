const express = require('express');

const router = express();

const authMiddleware = require('../middlewares/auth');
const AccountController = require('../controllers/AccountController');

router.use(authMiddleware);

router.get('/:UserID', AccountController.Index);

router.post('/:identifier/transfer', AccountController.Transaction);

router.get('/:identifier/bankStatements', AccountController.BankStatements);

module.exports = router;
