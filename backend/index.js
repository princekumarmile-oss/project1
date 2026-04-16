const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const POSTGRES_URL =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432/prince_college";

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true);
      if (/^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) return callback(null, true);
      if (/^https:\/\/.*\.vercel\.app$/.test(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/applications", applicationRoutes);

connectDB(POSTGRES_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("PostgreSQL connection failed:", error.message);
  });
