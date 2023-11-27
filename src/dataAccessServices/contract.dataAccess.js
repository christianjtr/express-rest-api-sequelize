const { Op } = require('sequelize');
const { isEmptyObject, removeUndefinedProps } = require('../utils/objectUtils');
const { Contract } = require('../model');

const getAll = async (filters = {}) => {

    let filtersToApply = {};
    if (!isEmptyObject(filters)) {
        const { status, ContractorId, ClientId } = filters;
        filtersToApply = {
            status: Array.isArray(status) ? { [Op.in]: status } : undefined,
            [Op.or]: {
                ContractorId,
                ClientId
            }
        };
    }
    
    const contracts = await Contract.findAll({ where: { ...removeUndefinedProps(filtersToApply) } });
    return contracts;
};

const getById = async (id, filters = {}) => {

    let filtersToApply = {};
    if (!isEmptyObject(filters)) {
        const { ContractorId, ClientId } = filters;
        filtersToApply = {
            id,
            [Op.or]: {
                ContractorId,
                ClientId
            }
        };
    }

    const contract = await Contract.findOne({ where: { ...removeUndefinedProps(filtersToApply) } });
    return contract;
};

module.exports = {
    getAll,
    getById
};
