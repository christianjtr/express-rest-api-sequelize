const httpStatus = require('http-status');
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

const getUnpaidJobs = async (req, res) => {
    
    const { profile } = req;

    try {
        const jobs = await jobService.getUnpaidJobs({ profile });
        if(!jobs) {
            res.status(httpStatus.NOT_FOUND).end();
        } else {
            res.status(httpStatus.OK).send({ data: jobs });
        }
    } catch (error) {
        res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
    }
};

const performJobPaymentById = async (req, res) => {
    
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
            if(hasUpdatedJob) res.status(httpStatus.NO_CONTENT).end();
        } else {
            res.status(httpStatus.NOT_ACCEPTABLE).end();
        }
    } catch(error) {
        res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
    }
};

module.exports = {
    isValidJobId,
    getUnpaidJobs,
    performJobPaymentById
};
