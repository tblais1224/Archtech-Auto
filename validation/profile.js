const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
    let errors = {};

    //if its not empty return name if not set to empty string to test in validator
    data.handle = !isEmpty(data.handle) ? data.handle : "";

    if (!validator.isLength(data.handle, {
            min: 2,
            max: 40
        })) {
        errors.handle = "Handle must be between 2 and 40 characters."
    }
    if (validator.isEmpty(data.handle)) {
        errors.handle = "Profile handle is required."
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};