const mongoose=require('mongoose');
const connectDB=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGOURI);
            console.log("mongodb connected");
    }catch{
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
}
module.exports=connectDB;
