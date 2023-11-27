const { Router } = require('express');
const contractRouter = require('./contract.router');

const router = Router();

router.use('/contracts', contractRouter);

module.exports = router;
