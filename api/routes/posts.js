const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//create a post

router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});
//update a post

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("you can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
// delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json("Post not found");
    }
    // Check if the logged in user is the owner of the post
    if (post.userId.toString() === req.body.userId) {
      await post.deleteOne();
      return res.status(200).json("The post has been deleted");
    } else {
      return res.status(403).json("You can delete only your post");
    }
  } catch (err) {
    console.error("Error while deleting post:", err);
    return res.status(500).json(err);
  }
});


//like / dislike a post

router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//get a post

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get timeline posts

router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.admiring.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});

//get user's all posts

router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get post count by username
const express = require('express'); 

router.get('/count/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);  // Find user by ID
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const postCount = await Post.countDocuments({ userId: userId });  // Use userId directly
    res.status(200).json({ count: postCount });
  } catch (err) {
    console.error('Error occurred while counting posts:', err);
    res.status(500).json({ error: 'An error occurred while counting the posts' });
  }
});


// add a comment to a post
router.post("/:id/comment", async (req, res) => {
  try {
      const post = await Post.findById(req.params.id);
      if (!post) {
          res.status(404).json("Post not found");
      } else {
          const newComment = {
              userId: req.body.userId,
              text: req.body.text,
              createdAt: new Date()
          };
    
          post.comments.push(newComment);
          await post.save();
          const savedComment = post.comments[post.comments.length - 1];
          // Populate the new comment with user data
          const populatedComment = await Post.populate(savedComment , {
            path: 'userId',
            select: 'username profilePicture'
          });
      
          res.status(200).json(populatedComment);
        } 
        }
        catch (err) {
          console.error(err);
          res.status(500).json("An error occurred while adding a comment");
        }
    }  );
    
    router.get("/:id/comments", async (req, res) => {
      try {
        const post = await Post.findById(req.params.id).populate({
          path: 'comments.userId',
          select: 'username profilePicture'
        });
    
        if (!post) {
          return res.status(404).json("Post not found");
        }
    
        res.status(200).json(post.comments);
      } catch (err) {
        res.status(500).json(err);
      }
    });


module.exports = router;


 