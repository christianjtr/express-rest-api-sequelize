const { Router } = require('express');
const { getProfile } = require('../middleware/getProfile');
const contractController = require('../controllers/contract.controller');

const router = Router();

router.use(getProfile);

router.get('/', contractController.getAllContracts);
router.get('/:id', contractController.isValidContractId, contractController.getContractById);

module.exports = router;
