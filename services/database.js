const mongoose = require("mongoose");
const companySchema = require("../model/companyModel");
const userSchema = require("../model/userModel");
const studentSchema = require("../model/studentsModel");

const schemaList = {
  companySchema: companySchema,
  userSchema: userSchema,
  studentSchema: studentSchema,
};

const url = process.env.MONGO_URL;
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

const updateByQuery = async (query, schema, data) => {
  const currentSchema = schemaList[schema];
  const dataRes = await currentSchema.updateOne(query, data);
  return dataRes;
};

//**** FETCH STUDENT DETAILS *****/
const countData = async (schema) => {
  const currentSchema = schemaList[schema];
  const dataRes = await currentSchema.countDocuments();
  return dataRes;
};

//****** PAGINATE (SHOW STUDENT DETAILS) ********/
const paginateData = async () => {};

module.exports = {
  createRecord: createRecord,
  getRecordByQuery: getRecordByQuery,
  updateByQuery: updateByQuery,
  countData: countData,
  paginateData:paginateData
};
