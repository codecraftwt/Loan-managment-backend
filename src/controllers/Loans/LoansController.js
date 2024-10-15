const express = require("express");
const Loan = require("../../models/Loan");

const AddLoan = async (req, res) => {
  try {
    const LoanData = req.body;
    const createLoan = new Loan(LoanData);
    await createLoan.save();

    return res.status(201).json(createLoan);
  } catch (error) {
    return res.status(500).json({
      massage: "Server Error",
      massage: `error: ${error}`,
    });
  }
};

const ShowAllLoan = async (req, res) => {
  try {
    const AllLoans = await Loan.find();
    return res
      .status(200)
      .send({ massage: "Loans Data Fetch successfully", data: AllLoans });
  } catch (error) {
    return res.status(500).json({
      massage: "Server Error",
      massage: `error: ${error}`,
    });
  }
};

const GetLoanDetails = async (req, res) => {
  try {
    const LoanId = req.params.id;
    const loan = await Loan.findById(LoanId);

    if (!loan) return res.status(404).json({ message: "Loan Data not found" });
    return res
      .status(200)
      .send({ massage: "Data Fetch successfully", data: loan });
  } catch (error) {
    return res.status(500).json({
      massage: "Server Error",
      massage: `error: ${error}`,
    });
  }
};

const deleteLoanDetails = async (req, res) => {
  try {
    const loanId = req.params.id;
    const loanData = await Loan.findByIdAndDelete(loanId);

    if (!loanData)
      return res.status(404).json({ message: "Loan Data not found" });
    return res
      .status(200)
      .json({ message: "Loan deleted Successfully", Data: loanData });
  } catch (error) {
    return res.status(500).json({
      massage: "Server Error",
      massage: `error: ${error}`,
    });
  }
};

const updateLoanDetails = async (req, res) => {
  try {
    const loanId = req.params.id;
    const loanUpdateData = await Loan.findByIdAndUpdate(loanId, req.body, {
      new: true,
    });
    if (!loanUpdateData)
      return res.status(404).json({ message: "Loan Data not found" });
    res.json(loanUpdateData);
  } catch (error) {
    return res.status(500).json({
      massage: "Server Error",
      massage: `error: ${error}`,
    });
  }
};
module.exports = {
  AddLoan,
  ShowAllLoan,
  GetLoanDetails,
  deleteLoanDetails,
  updateLoanDetails,
};
