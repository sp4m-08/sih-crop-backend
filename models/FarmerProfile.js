// models/userProfile.js

import mongoose from "mongoose";

const farmerProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'User' // Links to the User model
    },
    location: {
        type: String,
        required: false
    },
    preferredCrop: {
        type: String,
        required: false
    },
    farmSizeAcres: {
        type: Number,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const farmerProfile = mongoose.models.UserProfile || mongoose.model("farmerProfile", farmerProfileSchema);
export default farmerProfile;