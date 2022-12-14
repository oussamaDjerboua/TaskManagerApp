const mongoose = require('mongoose')
const validator = require('validator')

const testSchema = mongoose.Schema({
    description:{
        type:String,
        trim:true,
        required:true,
 
    },
    completed:{ 
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        require: true,
        ref:'User'
    }
},{
    timestamps:true
})
const Task = mongoose.model('Task',testSchema)

module.exports = Task