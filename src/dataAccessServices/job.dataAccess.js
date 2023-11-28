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

const getJobById = async (jobId, options = {}) => {
    
    const { includeContract } = options;
    
    const job = await Job.findOne({ 
        where: { 
            id: jobId 
        }, 
        ...(includeContract && { include: { model: Contract } })
    });
    
    return job;
};

const updateJobById = async (jobId, payload, options = {}) => {
    
    const { returning } = options;

    const updatedJob = await Job.update({ ...payload }, {
        where: {
            id: jobId
        },
        ...(returning && { returning: true })
    });

    return updatedJob;
};

module.exports = {
    getFiltered,
    getJobById,
    updateJobById
};
