const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  saveForm,
  saveFranchiseForm,
  saveCareerForm,
} = require("../controllers/formController");
const upload = multer({ storage: multer.memoryStorage() });
// POST /api/forms/ulwe
router.post("/ulwe", saveForm);
// POST /api/forms/franchise
router.post("/franchise", saveFranchiseForm);
//POST /api/forms/career
router.post("/career", upload.single("resume"), saveCareerForm);
module.exports = router;