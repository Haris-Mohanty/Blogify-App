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
  password: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//****** EXPORT *****/
module.exports = mongoose.model("Company", companySchema);
