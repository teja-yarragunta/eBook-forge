const express = require("express");
const {
  exportAsDocument,
  exportAsPDF,
} = require("../controllers/exportController");
const { authUser } = require("../middlewares/authMiddleware");

const exportRouter = express.Router();

exportRouter.use(authUser);

exportRouter.get("/pdf/:id", exportAsPDF);
exportRouter.get("/doc/:id", exportAsDocument);

module.exports = exportRouter;
