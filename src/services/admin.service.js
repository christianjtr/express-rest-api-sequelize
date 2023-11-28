const profileDataAccessService = require('../dataAccessServices/profile.dataAccess');
const jobDataAccessService = require('../dataAccessServices/job.dataAccess');

const mapToBestClientDTO = (paidJobsGroupedByContract, clients) => {
    
    const paidJobs = paidJobsGroupedByContract.map((job) => ({ ...job.dataValues }));
    const bestClients = clients.map((client) => ({
        id: client.id,
        fullName: `${client.firstName} ${client.lastName}`,
        paid: paidJobs.filter((job) => client.id === job.Contract.ClientId).reduce((acc, obj) => acc + obj.totalPaid, 0)
    })).sort((a, b) => b.paid - a.paid);

    return bestClients;
};

const getBestClients = async (filterCriteria) => {
    try {
        
        const { startDate, endDate, limit } = filterCriteria;

        const paidJobsGroupedByContract = await jobDataAccessService.getAggregationOfJobsPricesByCriteria({
            paid: true,
            startDate,
            endDate
        }, ['ContractorId'],
        limit);

        const clientIds = new Set(paidJobsGroupedByContract.map((jobs) => jobs.Contract.ClientId));

        const clients = await profileDataAccessService.getFiltered({ profileIds: Array.from(clientIds) });

        const bestClients = mapToBestClientDTO(paidJobsGroupedByContract, clients);

        return bestClients;
    } catch(error) {
        console.error('getBestClients: Can not get best clients');
        throw error;
    }
};

module.exports = {
    getBestClients
};
