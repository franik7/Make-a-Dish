const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comments");
const { ensureAuth } = require("../middleware/auth");

// Create a comment
router.post("/createComment/:id", commentsController.createComment);


module.exports = router;
