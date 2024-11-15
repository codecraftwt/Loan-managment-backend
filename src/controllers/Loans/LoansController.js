const express = require("express");
const Loan = require("../../models/Loan");
const Subscription = require("../../models/Subscription");

const AddLoan = async (req, res) => {
  try {
    const lenderId = req.user.id; //get from JWT
    const LoanData = req.body;

    // Check if the user has an active subscription
    const activeSubscription = await Subscription.findOne({
      user: lenderId,
      isActive: true,
      subscriptionExpiry: { $gte: new Date() },
    });

    if (!activeSubscription) {
      return res.status(403).json({
        message: "You must have an active subscription to add a loan",
      });
    }

    const createLoan = new Loan({
      ...LoanData,
      lenderId,
    });

    await createLoan.save();

    return res.status(201).json(createLoan);
  } catch (error) {

    if (error.name === "ValidationError") {

      const errorMessages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Validation error",
        errors: errorMessages, // Return an array of error messages
      });
    }

    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const ShowAllLoan = async (req, res) => {
  try {
    const allLoans = await Loan.find();
    return res.status(200).json({
      message: "Loans data fetched successfully",
      data: allLoans,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const GetLoanDetails = async (req, res) => {
  try {
    const loanId = req.params.id;
    const loan = await Loan.findById(loanId);

    if (!loan) {
      return res.status(404).json({ message: "Loan data not found" });
    }

    return res.status(200).json({
      message: "Loan data fetched successfully",
      data: loan,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const deleteLoanDetails = async (req, res) => {
  try {
    const loanId = req.params.id;
    const loanData = await Loan.findByIdAndDelete(loanId);

    if (!loanData) {
      return res.status(404).json({ message: "Loan data not found" });
    }

    return res.status(200).json({
      message: "Loan deleted successfully",
      data: loanData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const updateLoanDetails = async (req, res) => {
  try {
    const loanId = req.params.id;
    const loanUpdateData = await Loan.findByIdAndUpdate(loanId, req.body, {
      new: true,
    });

    if (!loanUpdateData) {
      return res.status(404).json({ message: "Loan data not found" });
    }

    return res.status(200).json({
      message: "Loan updated successfully",
      data: loanUpdateData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const updateLoanStatus = async (req, res) => {
  const { loanId } = req.params;
  const { status } = req.body;

  // Check if the status is either "pending" or "paid"
  if (!["pending", "paid"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value. Only 'pending' or 'paid' are allowed." });
  }

  try {
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    // Check if the loan is already in the same status
    if (loan.status === status) {
      return res.status(400).json({ message: `Loan is already marked as '${status}'` });
    }

    // Update the loan status
    loan.status = status;
    await loan.save();

    return res.status(200).json({
      message: "Loan status updated successfully",
      loan,
    });
  } catch (error) {
    console.error("Error updating loan status:", error);
    return res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};


const getLoansByLender = async (req, res) => {
  try {
    const lenderId = req.user.id;  // Extracting lender's ID from the JWT token

    const loans = await Loan.find({ lenderId });

    if (!loans || loans.length === 0) {
      return res.status(404).json({ message: "No loans found for this lender" });
    }

    return res.status(200).json({
      message: "Loans fetched successfully",
      data: loans,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


const getLoanByAadhaar = async (req, res) => {
  const { aadhaarNumber } = req.query;

  if (!aadhaarNumber) {
    return res.status(400).json({ message: "Aadhaar number is required" });
  }

  try {
    const loans = await Loan.find({ aadhaarNumber });

    if (loans.length === 0) {
      return res.status(404).json({ message: "No loans found for this Aadhaar number" });
    }

    const totalAmount = loans.reduce((sum, loan) => sum + loan.amount, 0);

    return res.status(200).json({
      message: "Loan data fetched successfully",
      totalAmount,
      data: loans,
    });
  } catch (error) {
    console.error("Error fetching loan data by Aadhaar:", error);
    return res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};


module.exports = {
  AddLoan,
  ShowAllLoan,
  GetLoanDetails,
  deleteLoanDetails,
  updateLoanDetails,
  getLoansByLender,
  getLoanByAadhaar,
  updateLoanStatus
};
