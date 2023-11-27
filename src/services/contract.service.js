const contractDataAccessService = require('../dataAccessServices/contract.dataAccess');

const getAllContracts = async () => {
    
    const contracts = await contractDataAccessService.getAll();
    return contracts;
};

module.exports = {
    getAllContracts
};
