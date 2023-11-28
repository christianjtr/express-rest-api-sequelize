const jobService = require('../services/job.service');
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

const processClientDeposit = async (profile, amountToDeposit) => {
    try {
        const unpaidJobs = await jobService.getUnpaidJobs({ profile });
        const totalAmountToPay = unpaidJobs.map(({ price }) => price).reduce((acc, item) => acc + item, 0);

        const allowDeposit = amountToDeposit <= (totalAmountToPay * 25) / 100;

        if(!allowDeposit) {
            throw Error(`Deposit Issue: Sorry, you are not allowed to deposit an amount of ${amountToDeposit} in your balance`);
        }

        const { balance: currentBalance } = await profileDataAccessService.getById(profile.id);

        const updatedProfile = await profileDataAccessService.updateById(profile.id, { balance: currentBalance + amountToDeposit });
        
        return updatedProfile;
    } catch(error) {
        console.error(`processClientDeposit: Can not process the deposit of ${amountToDeposit} for client ${profile.id}`);
        throw error;
    }
};

module.exports = {
    processJobPayment,
    processClientDeposit
};
