const express = require('express');
const { PostModel } = require('../Models/Post.model');

const postRouter = express.Router();

postRouter.get("/",async(req,res)=>{
    const device = req.params.device;
    if(device){
        try {
            const posts = await PostModel.find({"device":device})
            res.send(posts);
        } catch (error) {
            console.log(error);
            console.log({"msg":"Something went wrong to get data"})
        }
    }else{
        try {
            const posts = await PostModel.find();
            res.send(posts);
        } catch (error) {
            console.log(error);
            res.send({"msg":"Something went wrong to get data"})
        }
    }
});


postRouter.post("/add",async(req,res)=>{
    const payload = req.body;
    try {
        const new_post = await PostModel(payload);
        await new_post.save();
        res.send("added new post");
    } catch (error) {
        console.log(error);
            res.send({"msg":"Something went wrong to add data"})
    }
});

postRouter.patch("/update/:id",async(req,res)=>{
    const payload = req.body;
    const id = req.params.id;
    const post = await PostModel.find({"_id":id});
    const userID_in_post = post.userID;
    const userId_making_req = req.body.userID;
    try {
        if(userId_making_req != userID_in_post){
            res.sendStatus("Your Not Authorized");
        }else{
            await PostModel.findByIdAndUpdate({"_id":id,payload});
            res.send({"msg":"Updated the post"});
        }
    } catch (error) {
        console.log(error);
            res.send({"msg":"Something went wrong to update post"})
    }
})

postRouter.delete("/delete",async(req,res)=>{
    const id = req.params.id;
    const post = await PostModel.find({"_id":id});
    const userID_in_post = post.userID;
    const userID_making_req = req.body.userID;
    try {
        if(userID_making_req != userID_in_post){
            res.sendStatus("Your Not Authorized");
        }else{
            await PostModel.findByIdAndDelete({"_id":id});
            res.send({"msg":"Deleted the post"});
        }
    } catch (error) {
        console.log(error);
        res.send({"msg":"Something went wrong to delete post"})
    }
});

module.exports ={
    postRouter
}