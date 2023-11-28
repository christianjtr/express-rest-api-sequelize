const jobDataAccessService = require('../dataAccessServices/job.dataAccess');

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

module.exports = {
    getUnpaidJobs,
};
