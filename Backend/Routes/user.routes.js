const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { UserModel } = require('../Models/User.model');
require("dotenv").config();

const userRouter = express.Router();

userRouter.post("/register",async(req,res)=>{

    const {name , email , gender , password , age, city ,is_married } = req.body;

    try {
        bcrypt.hash(password,5,async(err,sec_pass)=>{
            if(err){
                console.log(err);
            }else{
                const user = new UserModel({name , email , gender , password:sec_pass , age, city ,is_married });
                await user.save();
                res.send({"msg":"user Registration Successfully"});
            }
        })
    } catch (error) {
        res.send({"error":"Error in User Registration"});
        console.log(error);
    }
});
userRouter.post("/login",async(req,res)=>{
    const {email , password} = req.body;
    try {
        const user = await UserModel.find({email});
        const sec_pass = user[0].password ;
        if(user.length>0){
            bcrypt.compare(password, sec_pass,(err,res)=>{
                if(err){
                    console.log(err);
                    res.send({"msg":"Wrong Password"});
                }else{
                    const token = jwt.sign({userId:user[0]._id},process.env.key);
                    res.send({"msg":"Login Successfully","token":token});
                }
            })
        }
    } catch (error) {
        res.send({"error":"Error in Login page"});
        console.log(error);
    }
})

module.exports ={
    userRouter
}