const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");

// GET USER
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            try {
                await Post.deleteMany({ username: user.username });
                await User.findByIdAndDelete(req.params.id);
                res.status(200).json("User has been deleted...");
            } catch (err) {
                res.status(500).json(err);
            }
        } catch (err) {
            res.status(404).json("User not found!");
        }
    } else {
        res.status(401).json("You can delete only your account!");
    }
});

//! update using cloudinary

router.put("/:id", upload.single("profilePic"), async (req, res) => {
    const { username, email, userId } = req.body;
    const user_id = req.params.id;

    if (userId === user_id) {
        try {
            const user = await User.findById(user_id);

            let result;
            if (req.file) {
                if (user?.cloudinary_id) {
                    await cloudinary.uploader.destroy(user.cloudinary_id);
                }
                result = await cloudinary.uploader.upload(req.file.path);
            }

            const data = {
                username: username || user.username,
                email: email || user.email,
                cloudinary_id: result?.public_id || user.cloudinary_id,
                profilePic: result?.secure_url || user.profilePic,
            };

            const updateProfile = await User.findByIdAndUpdate(user_id, data, {
                useFindAndModify: false,
                runValidators: true,
                new: true,
            });
            if (req.body.username) {
                const posts = await Post.find({ userId });
                // Update the username on each post
                for (const post of posts) {
                    post.username = updateProfile?.username;
                    await post.save();
                }
            }

            res.status(200).json({
                updateProfile,
                message: `${updateProfile.username} has been successfully updated your profile }`,
            });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    } else {
        res.status(401).json("you can only update your account");
    }
});
module.exports = router;
