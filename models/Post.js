const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
            required: true,
        },
        photo: {
            type: String,
            required: false,
        },
        username: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        categories: {
            type: Array,
            require: false,
        },
        cloudinary_id:{
            type: String,
        },
        image:{
            type: String,
        }
    },

    { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
