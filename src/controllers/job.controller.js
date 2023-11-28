const Joi = require('@hapi/joi');

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

const validatePaymentPayload = async (req, res, next) => {
    try {
        
        const queryObject = Joi.object({
            amountToPay: Joi.number().min(0).required(),
        });

        const { amountToPay } = await queryObject.validateAsync(req.body);

        req.safeFields = {
            ...(req.safeFields || {}),
            amountToPay,
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

const launchJobPaymentById = async (req, res, next) => {
    
    const { jobId, amountToPay } = req.safeFields;
    const { profile } = req;
    
    try {
        const hasPaidJob = await jobService.launchJobPaymentById(jobId, profile, amountToPay);
        if(!hasPaidJob) {
            res.status(404).end();
        } else {
            res.status(200).send();
        }
    } catch(error) {
        next(error);
    }
};

module.exports = {
    isValidJobId,
    validatePaymentPayload,
    getUnpaidJobs,
    launchJobPaymentById
};
