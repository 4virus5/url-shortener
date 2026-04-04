const mongoose = require('mongoose')

const urlSchema = new mongoose.Schema({
    originalUrl:{
        type:String,
        required:true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    shortUrl:{
        type:String,
        required:true,
        index:true,
        unique:true
    },
    clicks:{
        type:Number,
        default:0
    },
    clickHistory: [{
        timestamp: { type: Date, default: Date.now }
    }],
    isActive: {
        type: Boolean,
        default: true
    }
    
},{timestamps:true})

module.exports = mongoose.model('url',urlSchema)