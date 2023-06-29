
const express = require("express")
const msgRouter = express.Router()
msgRouter.use(express.json())
const {msgmodel} = require("../models/mesage.schema")

msgRouter.get("/message",async(req,res)=>{
       try{
        let newMessage =  await msgmodel.find()     
         res.send(newMessage);
       }catch(err){
         res.send({mes:err.message})
       }      
})

module.exports={msgRouter}