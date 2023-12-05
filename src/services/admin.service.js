const { groupBy, maxBy } = require('lodash');
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

const mapToBestContractorsDTO = (paidJobsGroupedByContract, contractors) => {
    
    const paidJobs = paidJobsGroupedByContract.map((job) => ({ ...job.dataValues }));
    const bestContractors = contractors.map((contractor) => ({
        id: contractor.id,
        fullName: `${contractor.firstName} ${contractor.lastName}`,
        profession: contractor.profession,
        paid: paidJobs.filter((job) => contractor.id === job.Contract.ContractorId).reduce((acc, obj) => acc + obj.totalPaid, 0)
    })).sort((a, b) => b.paid - a.paid);

    return bestContractors;
};

const extractMostPaidProfession = (bestContractors) => {
    const professions = Object.entries(groupBy(bestContractors, ({ profession }) => profession))
        .map(([key, value]) => ({
            profession: key,
            paid: value.reduce((acc, item) => acc + item.paid, 0)
        }));

    const mostPaidProfession = maxBy(professions, ({ paid }) => paid);
    
    return mostPaidProfession;
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

const getBestProfession = async (filterCriteria) => {
    
    try {

        const { startDate, endDate } = filterCriteria;

        const paidJobsGroupedByContract = await jobDataAccessService.getAggregationOfJobsPricesByCriteria({
            paid: true,
            startDate,
            endDate
        }, ['ContractorId'],
        -1);

        const contractorIds = new Set(paidJobsGroupedByContract.map((jobs) => jobs.Contract.ContractorId));

        const contractors = await profileDataAccessService.getFiltered({ profileIds: Array.from(contractorIds) });

        const bestContractorsDTO = mapToBestContractorsDTO(paidJobsGroupedByContract, contractors);

        const mostPaidProfession = extractMostPaidProfession(bestContractorsDTO);

        return mostPaidProfession;
    } catch(error) {
        console.error('getBestProfession: Can not get best profession');
        throw error;
    }
};

module.exports = {
    getBestClients,
    getBestProfession
};
