

const mongoose = require('mongoose');
const schema = mongoose.Schema

const authSchema = new schema({
    name:{
        type: String,
        required: true
    },
    email:{ 
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    profile_image:{
        type: String,
        default: null
    },
    about:{
        type: String,
        default: null
    },
          
},{timestamps: true, versionkey: false})


const authModel = mongoose.model('auth', authSchema)
module.exports = authModel