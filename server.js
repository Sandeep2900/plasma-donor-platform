const express = require("express");
const dotenv = require("dotenv");
const colors = require('colors');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require("./config/db");

// dot config
dotenv.config();
connectDB();

// rest Object
const app = express();

// Middleware to disable caching
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  next();
});

//middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// routes
// 1 test route
app.use("/api/v1/test", require("./routes/testRoutes"));
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/inventory", require("./routes/inventoryRoutes"));
app.use("/api/v1/analytics", require("./routes/analyticsRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));

// port
const PORT = process.env.PORT || 8080;

// listen
app.listen(PORT, () => {
  console.log(`Node server running in ${process.env.DEV_MODE} mode on port ${process.env.PORT}`.bgBlue.white);
});
