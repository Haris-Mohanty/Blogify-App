const bcrypt = require("bcrypt");

const encrypt = async (data) => {
  const encryptedData = await bcrypt.hash(data, 12);
  return encryptedData;
};

const dcrypt = async (realPassword, typePassword) => {
  const isVerified = await bcrypt.compare(typePassword, realPassword);
  return isVerified;
};

module.exports = {
  encrypt: encrypt,
  dcrypt: dcrypt,
};
