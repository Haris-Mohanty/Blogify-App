const mongoose = require("mongoose");
const bcryptService = require("../services/bcryptService");

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  token:,
  expiresIn
  islogged
  updatedAt
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  const data = this.password;
  const encryptedData = await bcryptService.encrypt(data);
  this.password = encryptedData;
  next();
});

module.exports = mongoose.model("user", userSchema);
