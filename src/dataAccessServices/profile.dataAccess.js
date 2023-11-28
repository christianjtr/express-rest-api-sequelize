const { Profile } = require('../model');

const getById = async (profileId) => {

    const profile = await Profile.findOne({ 
        where: { id: profileId },
    });

    return profile;
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
    updateById
};
