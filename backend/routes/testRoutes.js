const express=require("express");
const router=express.Router()
const { protect } = require('../authmiddleware');
const { fetchTest } = require('../controller/testController'); 
const {fetchQuestion}=require('../controller/testController')
router.get('/',protect,fetchTest);
router.get('/:testId',protect,fetchQuestion)
module.exports = router;