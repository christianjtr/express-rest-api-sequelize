const httpStatus = require('http-status');
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

const getAllContracts = async (req, res) => {
    try {

        const { profile } = req;

        const contracts = await contractService.getAllContracts({ profile });
        res.status(httpStatus.OK).send({ data: contracts });
    } catch (error) {
        res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
    }
};

const getContractById = async (req, res) => {
    
    const { id } = req.safeFields;
    const { profile } = req;

    try {
        const contract = await contractService.getContractById(id, { profile });
        if(!contract) {
            res.status(httpStatus.NOT_FOUND).send({ message: `No contract has been found given Id ${id}` });
            res.end();
        } else {
            res.status(httpStatus.OK).send({ data: contract });
        }
    } catch (error) {
        res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
    }
};

module.exports = {
    isValidContractId,
    getAllContracts,
    getContractById
};
