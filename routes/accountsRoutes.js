const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

router.get('/', accountController.getAllAccounts);
router.get('/:id', accountController.getAccountById);
router.post('/', express.json(), accountController.addAccount);
router.post('/:id', express.json(), accountController.updateAccount);
router.get('/:id/delete', accountController.deleteAccount);
router.get('/:id/register',accountController.registerAccount);
router.get('/:id/start',accountController.startAccount);

module.exports = router;
