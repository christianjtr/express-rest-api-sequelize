const isEmptyObject = (obj) => typeof obj === 'object' && Object.keys(obj).length === 0;
const removeUndefinedProps = (obj) => {
    const cleanedObject = obj;
    Object.keys(cleanedObject).forEach((key) => cleanedObject[key] === undefined && delete cleanedObject[key]);
    return cleanedObject;
};

module.exports = {
    isEmptyObject,
    removeUndefinedProps
};
