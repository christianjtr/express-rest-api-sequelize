const { Router } = require('express');
const profileController = require('../controllers/profile.controller');
const paymentController = require('../controllers/payment.controller');

const router = Router();

router.post('/deposit/:userId', 
    profileController.isValidUserId,
    profileController.checkIsClientUser,
    paymentController.validateDepositPayload,
    paymentController.launchDeposit);

module.exports = router;
