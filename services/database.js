const mongoose = require("mongoose");
const companySchema = require("../model/companyModel");
const userSchema = require("../model/userModel");
const schemaList = {
  companySchema: companySchema,
  userSchema: userSchema,
};

const url = "mongodb://127.0.0.1:27017/blogify";
mongoose.connect(url);

const createRecord = async (data, schema) => {
  const currentSchema = schemaList[schema];
  const dataRes = await new currentSchema(data).save();
  return dataRes;
};

const getRecordByQuery = async (query, schema) => {
  const currentSchema = schemaList[schema];
  const dataRes = await currentSchema.find(query);
  return dataRes;
};



module.exports = {
  createRecord: createRecord,
  getRecordByQuery: getRecordByQuery,
}; 
