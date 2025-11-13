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
const allowedOrigins = [
  "http://localhost:5173",
  "https://e-book-forge.vercel.app",
];
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests like curl/postman with no origin
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"), false);
      }
    },
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// routes
app.use("/api/auth", authRouter);
app.use("/api/books", bookRouter);
app.use("/api/ai", aiRouter);
app.use("/api/export", exportRouter);

// db connection and start server
const PORT = process.env.PORT || 4000;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}..`);
    });
  })
  .catch((err) => {
    console.log(`server connection failed.. `, err);
  });
