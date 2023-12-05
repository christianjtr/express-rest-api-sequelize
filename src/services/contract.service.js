const contractDataAccessService = require('../dataAccessServices/contract.dataAccess');

const getAllContracts = async (payload = {}) => {
    try {
    
        const { profile, status } = payload;

        const contracts = await contractDataAccessService.getAll({
            ContractorId: profile.id || undefined,
            ClientId: profile.id || undefined,
            status: status || ['new', 'in_progress']
        });

        return contracts;
    } catch(error) {
        console.error('getAllContracts: Can not get contracts');
        throw error;
    }
    
};

const getContractById = async (id, payload = {}) => {
    try {

        const { profile } = payload;

        const contract = await contractDataAccessService.getById(id, {
            ContractorId: profile.id,
            ClientId: profile.id
        });

        return contract;
    } catch(error) {
        console.error(`getContractById: Can not get contract by Id ${id}`);
        throw error;
    }
    
};

module.exports = {
    getAllContracts,
    getContractById
};
