const router = require("express").Router();
const Post = require("../models/Post");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");

//CREATE POST

router.post("/", upload.single("image"), async (req, res) => {
    const { username, title, desc, userId } = req.body;

    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        const cloudinary_id = result.public_id;
        const image = result.secure_url;

        let newPost = new Post({
            username,
            title,
            desc,
            image,
            cloudinary_id,
            userId,
        });
        await newPost.save();
        res.status(201).json({ newPost, message: "posted successfully" });

    } catch (error) {
        res.status(500).json(error);
    }
});

// UPDATE POST

router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.username === req.body.username) {
            try {
                const updatedPost = await Post.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set: req.body,
                    },
                    { new: true }
                );
                res.status(200).json(updatedPost);
            } catch (error) {}
        } else {
            res.status(401).json("you can update only your post");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

// DELETE POST

router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            try {
                await post.delete();
                res.status(200).json("your post has been deleted...");
            } catch (error) {
                res.status(500).json(error);
            }
        } else {
            res.status(401).json("you can delete only your post!");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET POST
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET ALL POSTS

router.get("/", async (req, res) => {
    const username = req.query.user;
    const catName = req.query.cat;
    try {
        let posts;
        if (username) {
            posts = await Post.find({ username: username });
        } else if (catName) {
            posts = await Post.find({
                categories: {
                    $in: [catName],
                },
            });
        } else {
            posts = await Post.find().sort({ createdAt: -1 });
        }
        // posts.sort((a,b) =>)
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
