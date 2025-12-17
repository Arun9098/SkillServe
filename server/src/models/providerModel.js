const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"user",
            required:true,
        },
        servicesOffered: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "service",
            },
        ],
        rating: {
            type: Number,
            default: 0,
        },
        reviews: [
            {
               type: mongoose.Schema.Types.ObjectId,
               ref: "review", 
            },
        ],
        availableSlots: [
           {
            date: String,
            time: String,
           },
        ],
        isApproved: {
            type: Boolean,
            default: false,
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model("provider",providerSchema);