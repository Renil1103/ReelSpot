const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation");
const User = require("../models/User");


// Automatically generate conversation IDs with all friends
router.get("/chats/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.admiring.map((friendId) => User.findById(friendId))
    );

    let chats = [];
    for (let friend of friends) {
      let chat = await Conversation.findOne({
        members: { $all: [user._id, friend._id] },
      });
      if (!chat) {
        chat = new Conversation({
          members: [user._id, friend._id],
        });
        await chat.save();
      }
      chats.push(chat);
    }

    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;