const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateSellingInput(data) {
  let errors = {};

  data.type = !isEmpty(data.type) ? data.type : "";
  data.model = !isEmpty(data.model) ? data.model : "";
  data.manufacturer = !isEmpty(data.manufacturer) ? data.manufacturer : "";
  data.price = !isEmpty(data.price) ? data.price : "";

  if (validator.isEmpty(data.type)) {
    errors.type = "A vehicle type is required!";
  }
  if (validator.isEmpty(data.model)) {
    errors.model = "Must enter a vehicle model!";
  }
  if (validator.isEmpty(data.manufacturer)) {
    errors.manufacturer = "Must enter the original manufacturer of the vehicle your selling.";
  }
  if (validator.isEmpty(data.price)) {
    errors.price = "A selling price is required.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
