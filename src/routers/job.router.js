const { Router } = require('express');
const { getProfile } = require('../middleware/getProfile');
const profileController = require('../controllers/profile.controller');
const jobController = require('../controllers/job.controller');

const router = Router();

router.use(getProfile);

router.get('/unpaid', jobController.getUnpaidJobs);
router.post('/:job_id/pay', 
    profileController.checkIsClientUser, 
    jobController.isValidJobId,
    jobController.validatePaymentPayload, 
    jobController.launchJobPaymentById);

module.exports = router;
