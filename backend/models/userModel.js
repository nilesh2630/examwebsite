const mongoose = require('mongoose');
const bcrypt=require('bcryptjs')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

userSchema.methods.matchPassword=async function(enteredpass){
    return await bcrypt.compare(enteredpass,this.password);
   } 


userSchema.pre('save',async function(next){
    if(!this.isModified){
        next()
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt)
})
const User = mongoose.model('User', userSchema);
module.exports=User;
