const Joi = require('@hapi/joi');

const paymentService = require('../services/payment.service');

const validatePaymentPayload = async (req, res, next) => {
    try {
        
        const queryObject = Joi.object({
            amountToPay: Joi.number().min(0).required(),
        });

        const { amountToPay } = await queryObject.validateAsync(req.body);

        req.safeFields = {
            ...(req.safeFields || {}),
            amountToPay,
        };
        next();
    } catch (error) {
        next(error);
        
    }
};

const validateDepositPayload = async (req, res, next) => {
    try {
        
        const queryObject = Joi.object({
            amountToDeposit: Joi.number().min(0).required(),
        });

        const { amountToDeposit } = await queryObject.validateAsync(req.body);

        req.safeFields = {
            ...(req.safeFields || {}),
            amountToDeposit,
        };
        next();
    } catch (error) {
        next(error);
        
    }
};


const performClientDeposit = (req, res, next) => {
    try {

        const { profile } = req;
        const { amountToDeposit } = req.safeFields;
        const hasSusccededDeposit = paymentService.processClientDeposit(profile, amountToDeposit);

        res.status(200).send({ data: hasSusccededDeposit });
    } catch(error) {
        next(error);
    }
};

module.exports = {
    validatePaymentPayload,
    validateDepositPayload,
    performClientDeposit
};
