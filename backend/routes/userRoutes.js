const express=require("express");
const router=express.Router()
const {registerUser, authUser} =require("../controller/userController")
router.post('/',registerUser);
router.post('/login',authUser);
module.exports = router;