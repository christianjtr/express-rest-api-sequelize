const { Router } = require('express');
const { getProfile } = require('../middleware/getProfile');
const jobController = require('../controllers/job.controller');

const router = Router();

router.use(getProfile);

router.get('/unpaid', jobController.getUnpaidJobs);

module.exports = router;
