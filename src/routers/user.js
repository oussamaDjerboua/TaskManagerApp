const express = require('express')
const User = require('../models/user')
const sharp=require('sharp')
const auth = require('../middleware/auth')
const router = new express.Router()
const multer = require('multer')




// create a new user
router.post('/users',async (req,res)=>{
    const user = new User(req.body)
    try{
        const token = await user.generateAuthToken()
        await user.save()
        res.status(201).send({user,token})
    } catch(e){
        res.status(400).send(e)
    }
    
})
//login user
router.post('/users/login',async(req,res)=>{
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (e) {
        res.status(400).send()
    }
})

//logout user
router.post('/users/logout',auth,async (req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//log out of all sessions
router.post('/users/logoutAll',auth, async (req,res)=>{
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
}) 


//find all users

router.get('/users/me', auth ,async (req,res)=>{
    res.send(req.user)  
}) 


//update a user
router.patch('/users/me',auth, async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdate = ['name','email','password','age']
    const isValidOperation = updates.every((update)=>{
        return allowedUpdate.includes(update)
    })
    if(!isValidOperation){
        return res.status(400).send({error : 'invalid updates'})
    }
    
    try {
    
        updates.forEach((update)=>{
            req.user[update] = req.body[update]
        })
        await req.user.save()
        //const user = await User.findByIdAndUpdate(_id,req.body, {new :true,returnDocument:true})
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

//delete a user 

router.delete('/users/me',auth,async(req,res)=>{
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send
    }
})

//Post avatar for a user
const upload = multer({
    limits:{
        fileSize: 1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error ('please upload a Picture ducument'))
        }
        cb(undefined,true)
    }
})

router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
    const buffer =await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar =  buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error: error.message})
})

//delete an avatar by the user
router.delete('/users/me/avatar',auth , async (req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send(req.user)
})

// get an avatar by the id of the user
router.get('/users/:id/avatar', async (req,res)=>{
    try {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            return new Error()
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})
module.exports = router