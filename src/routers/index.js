const { Router } = require('express');
const contractRouter = require('./contract.router');
const jobRouter = require('./job.router');
const balanceRouter = require('./balance.router');
const adminRouter = require('./admin.router');

const router = Router();

router.use('/contracts', contractRouter);
router.use('/jobs', jobRouter);
router.use('/balances', balanceRouter);
router.use('/admin', adminRouter);

module.exports = router;
