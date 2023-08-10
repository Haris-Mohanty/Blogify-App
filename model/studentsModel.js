const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  companyId: String,
  studentName: String,
  studentEmail: {
    type: String,
    unique: true,
  },
  studentFather: String,
  studentDob: String,
  studentMobile: Number,
  studentCountry: String,
  studentState: String,
  studentPin: String,
  studentAddress: String,
});

module.exports = mongoose.model("student", studentSchema);
