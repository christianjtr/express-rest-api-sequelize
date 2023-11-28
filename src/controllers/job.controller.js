const Joi = require('@hapi/joi');

const paymentService = require('../services/payment.service');
const jobService = require('../services/job.service');

const isValidJobId = async (req, res, next) => {
    try {
        
        const queryObject = Joi.object({
            job_id: Joi.number().integer().required(),
        });

        const { job_id } = await queryObject.validateAsync(req.params);

        req.safeFields = {
            ...(req.safeFields || {}),
            jobId: job_id
        };
        next();
    } catch (error) {
        next(error);
        
    }
};

const getUnpaidJobs = async (req, res, next) => {
    
    const { profile } = req;

    try {
        const jobs = await jobService.getUnpaidJobs({ profile });
        if(!jobs) res.status(404).end();
        res.status(200).send({ data: jobs });
    } catch (error) {
        next(new Error(`getUnpaidJobs : Unable to retrieve unpaid jobs for user ${profile.id}`));
    }
};

const performJobPaymentById = async (req, res, next) => {
    
    const { jobId, amountToPay } = req.safeFields;
    const { profile } = req;
    
    try {
        const { isAllowedToProcessPayment, contract } = await jobService.performJobPaymentById(jobId, profile, amountToPay);
        if(isAllowedToProcessPayment) {
            await paymentService.processJobPayment({ 
                ClientId: contract.ClientId, 
                ContractorId: contract.ContractorId, 
                amountToPay 
            });

            const hasUpdatedJob = await jobService.updateJobById(jobId, { paid: true, paymentDate: new Date() });
            if(hasUpdatedJob) res.status(204).end();
        } else {
            res.status(404).end();
        }
    } catch(error) {
        next(error);
    }
};

module.exports = {
    isValidJobId,
    getUnpaidJobs,
    performJobPaymentById
};
