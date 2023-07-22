const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  company: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
  },
  mobile: Number,
  emailVerified: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//Duplicate data checked
companySchema.pre("save", function () {
  const query
});

//****** EXPORT *****/
module.exports = mongoose.model("Company", companySchema);
