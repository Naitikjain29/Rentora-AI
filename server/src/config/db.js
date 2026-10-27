const mongoose = require("mongoose");

const connectDB = async(req,res) =>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo DB connected successfully :)");
        
    }
    catch(error){
          console.log(error,"DB Connection Failed :(");

    }
}

module.exports = connectDB