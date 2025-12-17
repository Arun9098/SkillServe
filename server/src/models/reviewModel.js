const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        provider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "provider",
            required: true,
        },
        provider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "service",
        },
        rating: {
            type: Number,
            required: true,
        },
        comment: {
            type: String,
            trim: true,
        },
    },
    {timestamps: true},
);

module.exports = mongoose.model("review",reviewSchema);