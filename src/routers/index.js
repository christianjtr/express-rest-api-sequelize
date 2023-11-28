const { Router } = require('express');
const contractRouter = require('./contract.router');
const jobRouter = require('./job.router');

const router = Router();

router.use('/contracts', contractRouter);
router.use('/jobs', jobRouter);

module.exports = router;
