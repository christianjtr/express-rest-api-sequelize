const jobService = require('../services/job.service');

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

module.exports = {
    getUnpaidJobs
};
