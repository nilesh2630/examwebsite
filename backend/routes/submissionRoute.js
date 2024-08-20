const express=require("express");
const router=express.Router()
const { protect } = require('../authmiddleware');
const{saveSelection}=require('../controller/submissionControl')
const {submitTest}=require('../controller/submissionControl')
router.post('/save',protect,saveSelection);
router.post('/submit', protect, submitTest);
module.exports = router;