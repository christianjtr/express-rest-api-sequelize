const jobDataAccessService = require('../dataAccessServices/job.dataAccess');

const getBestClients = async (filterCriteria) => {
    try {
        
        const { startDate, endDate, limit } = filterCriteria;

        const paidJobsGroupedByContract = await jobDataAccessService.getAggregationOfJobsPricesByCriteria({
            paid: true,
            startDate,
            endDate
        }, ['ContractorId'],
        limit);
        
        return paidJobsGroupedByContract;
    } catch(error) {
        console.error('getBestClients: Can not get best clients');
        throw error;
    }
};

module.exports = {
    getBestClients
};
