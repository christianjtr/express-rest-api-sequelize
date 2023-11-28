const Joi = require('@hapi/joi');

const adminService = require('../services/admin.service');

const validateQueryParams = async (req, res, next) => {
    try {
        
        const queryObject = Joi.object({
            start: Joi.date().iso().optional(),
            end: Joi.date().iso().min(Joi.ref('start')).optional(),
            limit: Joi.number().integer().optional()
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

const getBestClients = async (req, res, next) => {
    try {
        const { start: startDate, end: endDate, limit } = req.safeFields;

        const bestClients = await adminService.getBestClients({ startDate, endDate, limit });
        res.status(200).send({ data: bestClients });
    } catch(error) {
        next(error);
    }
};

module.exports = { 
    validateQueryParams, 
    getBestClients 
};
