const httpStatus = require('http-status');
const Joi = require('@hapi/joi');

const adminService = require('../services/admin.service');

const validateQueryParams = async (req, res, next) => {
    try {
        
        const queryObject = Joi.object({
            start: Joi.date().iso().optional(),
            end: Joi.date().iso().min(Joi.ref('start')).optional(),
            limit: Joi.number().integer().min(-1).optional()
        });

        const { start, end, limit } = await queryObject.validateAsync(req.query);

        req.safeFields = {
            ...(req.safeFields || {}),
            start,
            end,
            limit
        };
        next();
    } catch (error) {
        next(error);
    }};

const getBestClients = async (req, res) => {
    try {
        const { start: startDate, end: endDate, limit } = req.safeFields;

        const bestClients = await adminService.getBestClients({ startDate, endDate, limit });
        res.status(httpStatus.OK).send({ data: bestClients });
    } catch(error) {
        res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
    }
};

const getBestProfession = async (req, res) => {
    try {
        const { start: startDate, end: endDate } = req.safeFields;

        const bestProfession = await adminService.getBestProfession({ startDate, endDate });
        if(!bestProfession) {
            res.status(httpStatus.NOT_FOUND).send({ message: 'No best profession has been found' });
        } else {
            res.status(httpStatus.OK).send({ data: bestProfession });
        }
    } catch(error) {
        res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
    }
};

module.exports = { 
    validateQueryParams, 
    getBestClients,
    getBestProfession
};
