const mongoose = require("moongoose")
const { boolean } = require("webidl-conversions")

const UserSchema = new mongoose.Schema(
    {
    username: { type: String, required:true, unique:true},
    email:{type: String, required: true, unique: true},
    password: {type: String, required: true},
    idAdmin: {
        type: boolean,
        required: true,
        default: false,
    },
},
{ timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);