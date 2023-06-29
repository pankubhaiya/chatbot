const express = require("express")
const {userRouter} = require("./routes/user.router")
const { connect } = require("./config/connect")
const {msgmodel} = require("./models/mesage.schema")
const {msgRouter} = require("./routes/msg.router")
const cors = require("cors")
require("dotenv").config()
const app = express()
const http = require("http");
const {Server} = require("socket.io");
const httpServer = http.createServer(app);
const io = new Server(httpServer);


app.use(express.json())
app.use(cors())
app.use("/user",userRouter)
app.use("/msg",msgRouter)
app.get("/",(req,res)=>{
     res.send("welcome to home page")
})

io.on("connection",(socket)=>{
    socket.on("chat1",async(msg)=>{
        console.log(msg)
        let newMessage =  new msgmodel({name:msg.name,message:msg.msg})
         await newMessage.save()
        io.emit("chat2",msg)
    })
})

const port = process.env.port || 8080

httpServer.listen(port, async () => {
    try {
        await connect
        console.log("db is connect")

    } catch (err) {
        console.log(err.message)
    }
    console.log(`server is running at port ${port}`)
})