const express = require("express")
const app = express()
const PORT = 3000


app.use(express.json())

app.get("/", (req, res) => {
    res.send("received")
    console.log("received")
})
app.use("/saveform", require("./routes/route"));

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`)
})