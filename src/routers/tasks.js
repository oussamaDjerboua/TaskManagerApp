const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()



// create a new task
router.post('/tasks',auth,async (req,res)=>{
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
    
})
// GET/ tasks?completed = true
//GET/tasks?limit=10&skip=0
//GET/tasks?sortBy=vreatedAt:desc
router.get('/tasks',auth,async (req,res)=>{

    const match ={}
    const sort = {}
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]]= parts[1] === 'des'? -1 : 1 
    }
    try {
       // const tasks = await Task.find({owner:req.user.id})
       await req.user.populate({
        path:'tasks',
        match,
        options:{
            limit:parseInt(req.query.limit),
            skip:parseInt(req.query.skip),
            sort
        }
       })
       res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send()
    }
})

//fetch a task by its id
router.get('/tasks/:id',auth, async (req,res)=>{
    const _id = req.params.id
    try {
        const task = await Task.findOne({_id, owner:req.user.id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})


//update request
router.patch('/tasks/:id',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdate = ['description','completed']
    const isValidOperation = updates.every((update)=>allowedUpdate.includes(update))

if(!isValidOperation){
    return res.status(400).send({error : 'invalid updates'})
}

try {
const task = await Task.findOne({_id:req.params.id,owner:req.user.id})
if(!task){
    return res.status(404).send()
} 
updates.forEach((update) => {
    task[update] = req.body[update]
})
await task.save()
res.send(task)
    
} catch (e) {
    res.status(400).send(e)
}
})
//delete a task using id
router.delete('/tasks/:id',auth,async(req,res)=>{
    try {
        const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user.id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send
    }
})

module.exports = router