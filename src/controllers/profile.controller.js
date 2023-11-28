const Joi = require('@hapi/joi');

const profileService = require('../services/profile.service');

const isValidUserId = async (req, res, next) => {
    try {
        
        const queryObject = Joi.object({
            userId: Joi.number().integer().required(),
        });

        const { userId } = await queryObject.validateAsync(req.params);

        req.safeFields = {
            ...(req.safeFields || {}),
            clientId: userId
        };
        next();
    } catch (error) {
        next(error);
        
    }
};

const checkIsClientUser = async (req, res, next) => {
    const { profile } = req;
    const { clientId } = req?.safeFields || {};

    let userProfile = profile;

    if(!userProfile && clientId) {
        const requestedUserProfile = await profileService.getUserProfileById(clientId);
        userProfile = requestedUserProfile;
    }

    const isClientUser = userProfile.type === 'client';
    if(isClientUser) {
        req.profile = userProfile;
        next();
    }
    else {
        next(new Error('checkIsClientUser : Only users with role client can perform a payment/deposit operation'));
    }
};

module.exports = { 
    isValidUserId, 
    checkIsClientUser,
};
