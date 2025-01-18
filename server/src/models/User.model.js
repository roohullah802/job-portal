import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
dotenv.config()

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['student','recruiter'],
        required:true
    },
    profile:{
        bio:{type:String},
        skills:[String],
        resume:{type:String}, // URL to resume file
        resumeOriginalName:{type:String},
        company:{type:mongoose.Schema.Types.ObjectId, ref:'Company'}, 
        profilePhoto:{
            type:String,
            default:""
        }
    },
},{timestamps:true});

userSchema.pre("save",async function(next){
    if (!this.isModified("password")) return next();

    const hashPassword = await bcrypt.hash(this.password, 10)
    this.password = hashPassword
    next()
})

userSchema.methods.generateAccessToken = async function () {

    let obj = {
        _id: this._id,
        fullname: this.fullname,
        password: this.password,
        role: this.role
    }

    return jwt.sign(obj,process.env.SECRET_KET)
}

userSchema.methods.checkPassword = async function (password) {
    const isPass = await bcrypt.compare(password, this.password)
    return isPass
}

export const User = mongoose.model('User', userSchema);