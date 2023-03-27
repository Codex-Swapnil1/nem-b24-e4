const express = require('express');
const { connection } = require('./config/db');
const { authentication } = require('./Middleware/Authentication.middleware');
const { postRouter } = require('./Routes/post.routes');
const { userRouter } = require('./Routes/user.routes');

require("dotenv").config();

const app = express();
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Welcome to the Post Management System");
})
app.use("/users",userRouter);
app.use(authentication);
app.use("posts",postRouter);

app.listen(process.env.Port,async()=>{
    try {
        await connection
        console.log(`connected to ${process.env.Port}`);
    } catch (error) {
        console.log(error);
        console.log(`Failed to connect to ${process.env.Port}`);
    }
})