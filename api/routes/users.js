const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

// Update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
});

// Delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
});

// Get a user and include counts for admirers and admiring
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;

  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json("User not found");
    }
    const { password, updatedAt, ...other } = user._doc;

    const admirersCount = user.admirers.length;
    const admiringCount = user.admiring.length;

    res.status(200).json({ ...other, admirersCount, admiringCount });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get friends
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.admirers.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList);
  } catch (err) {
    res.status(500).json(err);
  }
});


// Follow a user
router.put("/:id/Admire", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.admirers.includes(req.body.userId)) {
        await user.updateOne({ $push: { admirers: req.body.userId } });
        await currentUser.updateOne({ $push: { admiring: req.params.id } });
        res.status(200).json("User has been followed");
      } else {
        res.status(403).json("You already follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can't follow yourself");
  }
});

// Unfollow a user
router.put("/:id/Disadmire", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.admirers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { admirers: req.body.userId } });
        await currentUser.updateOne({ $pull: { admiring: req.params.id } });
        res.status(200).json("User has been unfollowed");
      } else {
        res.status(403).json("You don't follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can't unfollow yourself");
  }
});

// Search users
router.get("/search", async (req, res) => {
  const searchQuery = req.query.q;

  try {
    const users = await User.find({
      $or: [
        { username: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
      ],
    });

    const searchResults = users.map(({ _id, username, profilePicture }) => ({
      _id,
      username,
      profilePicture,
    }));

    res.status(200).json(searchResults);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get user details
router.get("/getDetails", async (req, res) => {
  const userId = req.query.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json("User not found");
    }
    const { password, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
}); 
 
// Update user details
router.post("/updateDetails", async (req, res) => {
  const { userId, city, from, relationship, birthday } = req.body;
  try {
    const user = await User.findById(userId);
    if (user) {
      user.city = city || user.city;
      user.from = from || user.from;
      user.relationship = relationship || user.relationship;
      user.birthday = birthday || user.birthday;
      await user.save();
      res.status(200).json({ success: true, message: "User details updated successfully" });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating user details" });
  }
});


module.exports = router;
