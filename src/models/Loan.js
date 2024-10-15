// models/User.js
const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    aadhaarNumber: {
      type: String,
      required: true,
    },

    mobileNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    agreement: {
      type: String,
      required: true,
    },
    digitalSignature: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Loan = mongoose.model("Loan", loanSchema);

module.exports = Loan;
