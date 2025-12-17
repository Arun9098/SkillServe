const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
    {
        name: {
            type:String,
            required:true,
            trim:true,
        },
         email: {
            type:String,
            required:true,
            trim:true,
            unique:true,
        },
         phone: {
            type:String,
            required:true,
            trim:true,
            unique:true,
        },
         password: {
            type:String,
            trim:true,
        },
        role: {
            type:String,
            required:true,
            enum: ["user","provider","admin"],
        },
        profileImage: {
            type: String,
            trim: true
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model("user",userSchema);