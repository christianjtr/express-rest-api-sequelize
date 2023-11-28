const { Op } = require('sequelize');
const { removeUndefinedProps } = require('../utils/objectUtils');
const { Profile } = require('../model');

const getById = async (profileId) => {

    const profile = await Profile.findOne({ 
        where: { id: profileId },
    });

    return profile;
};

const getFiltered = async (filters) => {

    const { profileIds, ...otherFilters } = filters;
    
    const profiles = await Profile.findAll({ 
        where: removeUndefinedProps({
            id: Array.isArray(profileIds) ? { [Op.in]: profileIds } : undefined, 
            ...otherFilters 
        }) 
    });

    return profiles;
};

const updateById = async (profileId, payload) => {

    const updatedProfile = await Profile.update({ ...payload }, {
        where: {
            id: profileId
        }
    });

    return updatedProfile;
};

module.exports = {
    getById,
    getFiltered,
    updateById
};
