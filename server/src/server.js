const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRoute = require("../src/routes/userRoutes");


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/",userRoute);
dotenv.config();

app.get("/",(req,res)=>{
    res.send({msg:"SkillServe API is Running"})
})

// Connect DB
connectDB();

app.listen(process.env.PORT,()=>{
    console.log(`Server is Running at Port ${process.env.PORT}`);
})