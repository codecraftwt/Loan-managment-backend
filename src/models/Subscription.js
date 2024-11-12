const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        subscriptionPlan: {
            type: String,
            enum: ["monthly", "yearly", "trial"],
            required: true,
        },
        subscriptionStart: {
            type: Date,
            required: true,
        },
        subscriptionExpiry: {
            type: Date,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);
module.exports = Subscription;
