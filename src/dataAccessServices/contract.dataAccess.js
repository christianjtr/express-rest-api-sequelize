const { Contract } = require('../model');

const getAll = async () => {
    const contracts = await Contract.findAll();
    return contracts;
};

module.exports = {
    getAll
};
