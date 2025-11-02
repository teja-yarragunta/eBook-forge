const express = require("express");
const {
  exportAsDocument,
  exportAsPDF,
} = require("../controllers/exportController");
const { authUser } = require("../middlewares/authMiddleware");

const exportRouter = express.Router();

exportRouter.use(authUser);

exportRouter.post("/:id/doc", exportAsDocument);
exportRouter.post("/:id/pdf", exportAsPDF);

module.exports = exportRouter;