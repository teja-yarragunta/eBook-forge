require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const authRouter = require("./routes/authRoutes");
const bookRouter = require("./routes/bookRoutes");
const aiRouter = require("./routes/aiRoutes");
const exportRouter = require("./routes/exportRoutes");

const app = express();

//middleware
app.use(express.json());
// middleware to handle cors
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// static folder for uploads
app.use("/backend/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/api/auth", authRouter);
app.use("/api/books", bookRouter);
app.use("/api/ai", aiRouter);
app.use("/api/export", exportRouter);

// db connection and start server
const PORT = process.env.PORT;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}..`);
    });
  })
  .catch((err) => {
    console.log(`server connection failed.. `, err);
  });
