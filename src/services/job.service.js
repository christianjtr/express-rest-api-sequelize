const jobDataAccessService = require('../dataAccessServices/job.dataAccess');

const updateJobById = async (jobId, payload) => {
    const updatedJob = await jobDataAccessService.updateJobById(jobId, { ...payload });
    return updatedJob;
};

const getUnpaidJobs = async (payload) => {

    const { profile, contractStatuses } = payload;

    const jobs = await jobDataAccessService.getFiltered({
        ContractorId: profile.id,
        ClientId: profile.id,
        paid: false,
        contractStatuses: contractStatuses || ['in_progress']
    });
    return jobs;
};

const performJobPaymentById = async (jobId, profile, amountToPay) => {
    try {
        const { balance } = profile;

        if(balance < amountToPay) {
            throw Error(`Payment Issue: Sorry, You do not have enough funds to pay the job ${jobId}`);
        }

        const { 
            price: jobPrice, 
            paid: isPaidJob, 
            Contract 
        } = await jobDataAccessService.getJobById(jobId, { includeContract: true });

        if(isPaidJob) {
            throw Error(`Payment Issue: Sorry, Job ${jobId} has already been paid`);
        }
        
        if(amountToPay < jobPrice) {
            throw Error(`Payment Issue: Sorry, You do not have enough funds to pay the job ${jobId}`);
        }

        if(amountToPay > jobPrice) {
            throw Error(`Payment Issue: Sorry, You are triying pay more than the expected amount for the job ${jobId}`);
        }

        return {
            isAllowedToProcessPayment: !isPaidJob && amountToPay === jobPrice,
            contract: Contract
        };
    }
    catch(error) {
        console.error(`performJobPaymentById: Can not process the payment of ${amountToPay} for job ${jobId}`);
        throw error;
    }
};

module.exports = {
    updateJobById,
    getUnpaidJobs,
    performJobPaymentById,
};
