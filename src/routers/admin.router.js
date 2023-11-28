const { Router } = require('express');
const adminController = require('../controllers/admin.controller');

const router = Router();

router.get('/best-clients', adminController.validateQueryParams, adminController.getBestClients);

module.exports = router;

