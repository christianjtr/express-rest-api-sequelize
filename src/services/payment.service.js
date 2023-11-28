const profileDataAccessService = require('../dataAccessServices/profile.dataAccess');

const processJobPayment = async (payload) => {
    try {
        const { ClientId, ContractorId, amountToPay } = payload;
        
        const [clientProfile, contractorProfile] = await Promise.all([
            profileDataAccessService.getById(ClientId), 
            profileDataAccessService.getById(ContractorId)
        ]);

        const newClientBalance = clientProfile.balance - amountToPay;
        const newContractorBalance = contractorProfile.balance + amountToPay;

        await Promise.all([
            profileDataAccessService.updateById(ClientId, { balance: newClientBalance }), 
            profileDataAccessService.updateById(ContractorId, { balance: newContractorBalance })
        ]);
    } catch(error) {
        console.error('processJobPayment: Can not process the payment');
        throw error;
    }

    
};

module.exports = {
    processJobPayment
};
