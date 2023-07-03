const express = require("express")
const {userRouter} = require("./routes/user.router")
const { connect } = require("./config/connect")
const cors = require("cors")
require("dotenv").config()
const app = express()



app.use(express.json())
app.use(cors())
app.use("/user",userRouter)

app.get("/",(req,res)=>{
     res.send("welcome to home page")
})



const port = process.env.port || 8080

app.listen(port, async () => {
    try {
        await connect
        console.log("db is connect")

    } catch (err) {
        console.log(err.message)
    }
    console.log(`server is running at port ${port}`)
})