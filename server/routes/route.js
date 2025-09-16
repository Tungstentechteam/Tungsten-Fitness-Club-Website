const express = require("express")
const { saveform } = require("../controllers/form.controller")
const router = express.Router()

router.get("/", (req, res) => {
    res.send("welcome to home")
})
router.post("/", saveform)


module.exports = router