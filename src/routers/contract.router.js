const { Router } = require('express');
const contractController = require('../controllers/contract.controller');

const router = Router();

router.get('/', contractController.getAllContracts);

module.exports = router;
