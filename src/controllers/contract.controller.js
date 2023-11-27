const contractService = require('../services/contract.service');

const getAllContracts = async (req, res) => {
    try {
        const contracts = await contractService.getAllContracts();
        res.status(200).send({ data: contracts });
    } catch (error) {
        // TODO: Error || Validation handler...
    }
};

module.exports = {
    getAllContracts
};
