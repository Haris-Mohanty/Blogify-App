const mongoose = require("mongoose");
const companySchema = require("../model/companyModel");

const url = "mongodb://127.0.0.1:27017/blogify";
mongoose.connect(url);

const createRecord = async (data) => {
  const dataRes = await new companySchema(data).save();
};

module.exports = {
  createRecord: createRecord,
};
