const checkIsClientUser = async (req, res, next) => {
    const { profile } = req;
    const isClientUser = profile.type === 'client';
    if(isClientUser) next();
    else {
        next(new Error('checkIsClientUser : Only users with role client can perform a payment'));
    }
};

module.exports = { checkIsClientUser };
