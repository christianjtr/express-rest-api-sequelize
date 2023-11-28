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
            userId
        };
        next();
    } catch (error) {
        next(error);
        
    }
};

const checkIsClientUser = async (req, res, next) => {
    const { profile } = req;
    const { userId } = req.safeFields;

    let userProfile = profile;

    if(!userProfile && userId) {
        const requestedUserProfile = await profileService.getUserProfileById(userId);
        userProfile = requestedUserProfile;
    }

    const isClientUser = userProfile.type === 'client';
    if(isClientUser) next();
    else {
        next(new Error('checkIsClientUser : Only users with role client can perform a payment'));
    }
};

module.exports = { 
    isValidUserId, 
    checkIsClientUser,
};
