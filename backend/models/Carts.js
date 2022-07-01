const mongoose = require("moongoose")


const cartSchema = new mongoose.Schema(
    {
    userId: { type: String, required:true, unique:true},
    products:[
        {
            productId:{
                type:String
            },
            quantity:{
                type:Number,
                default:1,
            }
        }
    ],
    
},
{ timestamps: true }
);

module.exports = mongoose.model("Product", cartSchema);