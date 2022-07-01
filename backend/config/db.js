require("dotenv").config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("DB connection is running");
    } catch(error){
        console.error("DB connection failed");
        process.exit(1);
    }
}

module.exports = connectDB;