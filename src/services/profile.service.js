const profileDataAccessService = require('../dataAccessServices/profile.dataAccess');

const getUserProfileById = async (profileId) => {
    
    const profile = await profileDataAccessService.getById(profileId);
    return profile;
};

module.exports = {
    getUserProfileById
};
