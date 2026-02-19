const express = require("express");
const router = express.Router();
const {
  createPaste,
  getPaste
} = require("../controllers/pasteController");

router.post("/create", createPaste);
router.get("/:id", getPaste);

module.exports = router;
