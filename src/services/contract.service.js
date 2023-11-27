const contractDataAccessService = require('../dataAccessServices/contract.dataAccess');

const getAllContracts = async (payload = {}) => {

    const { profile, status } = payload;

    const contracts = await contractDataAccessService.getAll({
        ContractorId: profile.id || undefined,
        ClientId: profile.id || undefined,
        status: status || ['new', 'in_progress']
    });
    return contracts;
};

const getContractById = async (id, payload = {}) => {

    const { profile } = payload;

    const contract = await contractDataAccessService.getById(id, {
        ContractorId: profile.id,
        ClientId: profile.id
    });
    return contract;
};

module.exports = {
    getAllContracts,
    getContractById
};
