const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//register

router.post("/register", async (req, res) => {
    try {
        const existingUser = await User.findOne({username: req.body.username})
        if(existingUser) return res.status(409).json({message:'username already in use'})
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
        });
        const user = await newUser.save();
        res.status(200).json({message:`${user.username} saved successfully`});
    } catch (error) {
        res.status(500).json(error);
    }
});

//login

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if(!user) return res.status(404).json({message:'no user found'})

        const validated = await bcrypt.compare(req.body.password, user.password);
        if(!validated) return res.status(400).json("wrong credentials");

        const {password, ...others} = user._doc
        res.status(200).json(others)

    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
