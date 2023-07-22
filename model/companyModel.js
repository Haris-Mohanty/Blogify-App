const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  company: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
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

//Duplicate data checked(company name)
companySchema.pre("save", async function (next) {
  const query = {
    company: this.company,
  };
  const length = await mongoose.model("Company").countDocuments(query);
  if (length > 0) {
    throw next("Please change the Name, It is already exist!");
  } else {
    next();
  }
});

//Duplicate data checked(company name)
companySchema.pre("save", async function (next) {
  const query = {
    email: this.email,
  };
  const length = await mongoose.model("Company").countDocuments(query);
  if (length > 0) {
    throw next("Please change the Email, It is already exist!");
  } else {
    next();
  }
});

//****** EXPORT *****/
module.exports = mongoose.model("Company", companySchema);
