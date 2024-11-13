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
} = require("../../controllers/Loans/LoansController");
const authenticateUser = require("../../middlewares/authenticateUser");
const router = express.Router();

router.post('/add-loan', authenticateUser, AddLoan);

router.get('/get-loan-by-lender', authenticateUser, getLoansByLender)

router.get("/search-aadhar", getLoanByAadhaar);

router.get("/get-loan", ShowAllLoan);

router.get("/get-loan/:id", GetLoanDetails);

router.delete("/:id", deleteLoanDetails);

router.patch('/:loanId/status', updateLoanStatus);

router.patch("/:id", updateLoanDetails);

module.exports = router;
