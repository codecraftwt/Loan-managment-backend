const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const app = express();
const AuthRoutes = require("./routes/Auth/auth");
const LoanRoutes = require("./routes/Auth/Loan");

dotenv.config();
connectDB();

app.use(cors());

app.use(express.json());

app.use("/api/auth", AuthRoutes);
app.use("/api/loan", LoanRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
