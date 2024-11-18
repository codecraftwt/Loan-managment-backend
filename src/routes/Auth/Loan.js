const express = require("express");
const {
  AddLoan,
  ShowAllLoan,
  GetLoanDetails,
  deleteLoanDetails,
  updateLoanDetails,
  getLoansByLender,
  getLoanByAadhaar,
  updateLoanStatus,
  getLoansById,
} = require("../../controllers/Loans/LoansController");
const authenticateUser = require("../../middlewares/authenticateUser");
const router = express.Router();

router.post('/add-loan', authenticateUser, AddLoan);

router.get('/get-loan-by-lender', authenticateUser, getLoansByLender)

router.get("/get-loan-by-aadhar", getLoanByAadhaar);

router.get('/get-loan-by-id', authenticateUser, getLoansById)

// router.get("/get-loan", ShowAllLoan);

router.get("/get-loan", GetLoanDetails);

router.delete("/:id", deleteLoanDetails);

router.patch('/:loanId/status', updateLoanStatus);

router.patch("/:id", updateLoanDetails);

module.exports = router;
