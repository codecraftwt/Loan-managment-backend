const express = require("express");
const {
  AddLoan,
  ShowAllLoan,
  GetLoanDetails,
  deleteLoanDetails,
  updateLoanDetails,
} = require("../../controllers/Loans/LoansController");
const router = express.Router();

router.post("/add-loan", AddLoan);
router.get("/get-loan", ShowAllLoan);
router.get("/get-loan/:id", GetLoanDetails);
router.delete("/:id", deleteLoanDetails);
router.patch("/:id", updateLoanDetails);

module.exports = router;
