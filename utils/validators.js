//email validation
const isEmail = (email) => {
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegex)) return true;
  return false;
};

//check for empty feild
const isEmpty = (value) => {
  if (value.trim() === '') return true;
  return false;
};

exports.signupValidator = (data) => {
  let errors = {};

  if (!isEmail(data.email)) {
    errors.email = 'Must be a valid email';
  }
  if (isEmpty(data.email)) {
    errors.email = 'Must not be empty';
  }
  if (isEmpty(data.password)) {
    errors.password = 'Must not be empty';
  }
  if (data.password.length < 6) {
    errors.password = 'Password is shorter than mininum allowed length (6)';
  }
  if (isEmpty(data.shopOwnerName)) {
    errors.shopOwnerName = 'Must not be empty';
  }
  if (isEmpty(data.number)) {
    errors.number = 'Must not be empty';
  }
  if (data.number.length < 10) {
    errors.number = 'Must be a valid phone number';
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.loginValidator = (data) => {
  const errors = {};
  if (!isEmail(data.email)) {
    errors.email = 'Must be a valid email';
  }
  if (isEmpty(data.email)) {
    errors.email = 'Must not be empty';
  }
  if (isEmpty(data.password)) {
    errors.password = 'Must not be empty';
  }
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.shopDetailsValidator = (data) => {
  const errors = {};
  if (isEmpty(data.shopOwnerId)) {
    errors.shopOwnerId = 'Shop owner id not found';
  }
  if (isEmpty(data.shopName)) {
    errors.shopName = 'Must not be empty';
  }
  if (isEmpty(data.category)) {
    errors.category = 'Must not be empty';
  }
  if (isEmpty(data.address)) {
    errors.address = 'Must not be empty';
  }
  if (isEmpty(data.city)) {
    errors.city = 'Must not be empty';
  }
  if (isEmpty(data.pincode)) {
    errors.pincode = 'Must not be empty';
  }
  if (isEmpty(data.gstin)) {
    errors.gstin = 'Must not be empty';
  }
  if (data.gstin.length < 15) {
    errors.gstin = 'Please enter a valid GSTIN';
  }
  if (data.pincode.length < 6) {
    errors.pincode = 'Please enter a valid area pincode';
  }
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};
