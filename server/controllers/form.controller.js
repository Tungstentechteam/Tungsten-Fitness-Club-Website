const express = require("express")


exports.saveform = (req, res) => {
    console.log("Request body:", req.body);
    const { name, mobile } = req.body
    if (!name || !mobile) {
        return res.status(400).json({ error: "Name and mobile are required" });
    }
    console.log("Received name:", name)
    console.log("Received mobile:", mobile)
    res.status(200).json({ message: `name save successfully:${name},mobile number${mobile}` })

}
