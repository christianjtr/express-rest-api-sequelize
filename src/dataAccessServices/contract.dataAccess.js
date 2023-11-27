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

const getById = async (id) => {
    const contract = await Contract.findOne({ where: { id } });
    return contract;
};

module.exports = {
    getAll,
    getById
};
