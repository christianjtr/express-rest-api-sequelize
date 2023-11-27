const Joi = require('@hapi/joi');

const contractService = require('../services/contract.service');

const isValidContractId = async (req, res, next) => {
    try {
        
        const queryObject = Joi.object({
            id: Joi.number().integer().required(),
        });

        const { id } = await queryObject.validateAsync(req.params);

        req.safeFields = {
            ...(req.safeFields || {}),
            id,
        };
        next();
    } catch (error) {
        next(error);
        
    }
};

const getAllContracts = async (req, res, next) => {
    try {

        const { profile } = req;

        const contracts = await contractService.getAllContracts({ profile });
        res.status(200).send({ data: contracts });
    } catch (error) {
        next(new Error('getAllContracts : Unable to retrieve contracts'));
    }
};

const getContractById = async (req, res, next) => {
    
    const { id } = req.safeFields;

    try {
        const contract = await contractService.getContractById(id);
        if(!contract) res.status(404).end();
        res.status(200).send({ data: contract });
    } catch (error) {
        next(new Error(`getContractById : Unable to retrieve contract given id ${id}`));
    }
};

module.exports = {
    isValidContractId,
    getAllContracts,
    getContractById
};
