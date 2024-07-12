const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err)
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Wrong password" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/updateProfile", async (req, res) => {
  try {
    // Find the user
    const user = await User.findById(req.user._id);

    // Update the user with the new information
    user.city = req.body.city;
    user.from = req.body.from;
    user.relationship = req.body.relationship;
    user.birthday = req.body.birthday;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;