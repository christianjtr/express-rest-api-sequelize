const { Op, fn, col, where } = require('sequelize');
const { Job, Contract } = require('../model');

const getFiltered = async (filters) => {

    const { paid, ContractorId, ClientId, contractStatuses } = filters;
    
    const filtersToApply = {
        paid: where(fn('COALESCE', col('paid'), 0), paid)
    };
    
    const jobs = await Job.findAll({ 
        where: { ...filtersToApply },
        include: {
            model: Contract,
            where: {
                status: { [Op.in]: contractStatuses },
                [Op.or]: {
                    ContractorId,
                    ClientId
                }
            },
            attributes: [],
        } 
    });

    return jobs;
};

module.exports = {
    getFiltered
};
