const bcrypt = require("bcrypt");

const encrypt = async (data) => {
  const encryptedData = await bcrypt.hash(data, 12);
  return encryptedData;
};

const dcrypt = (realPassword, typePassword) => {
  bcrypt.compare
};

module.exports = {
  encrypt: encrypt,
  dcrypt: dcrypt,
};
