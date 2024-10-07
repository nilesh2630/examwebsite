const asyncHandler=require("express-async-handler");
const User=require("../models/userModel")
const generateToken=require("../config/generateToken")


const registerUser =asyncHandler( async (req, res) => {
    
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists!' });
        }

        const user=await User.create({
            name,email,password});
            if(user){
                res.status(201).json({
                    _id:user._id,
                    name:user.name,
                    email:user.email,
                    token:generateToken(user._id),
                });
            }else{
                res.status(400);
                throw new Error("failed to create user");
            }
   
})

const authUser=asyncHandler(async(req,res)=>{
   
    const {email,password}=req.body;
    const user=await User.findOne({email});
    if(user && (await user.matchPassword(password))){
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            token:generateToken(user._id),
            }) 
    }else{
        res.status(400);
        throw new Error("failed to create user");
    }
} )





module.exports = { registerUser,authUser };
