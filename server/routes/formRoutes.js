const express = require("express");
const router = express.Router();
const { saveForm } = require("../controllers/formController");

// POST /api/forms/ulwe
router.post("/ulwe", saveForm);

module.exports = router;