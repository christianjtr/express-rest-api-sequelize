const paymentService = require('./payment.service');
const jobDataAccessService = require('../dataAccessServices/job.dataAccess');

const updateJobById = async (jobId, payload) => {
    const updatedJob = await jobDataAccessService.updateJobById(jobId, { ...payload });
    return updatedJob;
};

const getUnpaidJobs = async (payload) => {

    const { profile } = payload;

    const jobs = await jobDataAccessService.getFiltered({
        ContractorId: profile.id,
        ClientId: profile.id,
        paid: false,
        contractStatuses: ['in_progress']
    });
    return jobs;
};

const launchJobPaymentById = async (jobId, profile, amountToPay) => {
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

        await paymentService.processJobPayment({ 
            ClientId: Contract.ClientId, 
            ContractorId: Contract.ContractorId, 
            amountToPay 
        });
        
        const hasUpdatedJob = await updateJobById(jobId, { paid: true, paymentDate: new Date() });

        return hasUpdatedJob;
    }
    catch(error) {
        console.error('jobPaymentById: Can not process the payment');
        throw error;
    }
};

module.exports = {
    getUnpaidJobs,
    launchJobPaymentById,
};
