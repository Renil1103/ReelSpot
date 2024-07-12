import { useContext, useState, useEffect } from 'react';
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import io from 'socket.io-client';
import "./post.css";

const socket = io("http://localhost:8900");

export default function Post({ post, onDelete }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);
  const [showDeleteOption, setShowDeleteOption] = useState(false);

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/users?userId=${post.userId}`);
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [post.userId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/posts/${post._id}/comments`);
        setComments(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchComments();
  }, [post._id]);

  useEffect(() => {
    const handleNewComment = ({ postId, comment }) => {
      if (postId === post._id) {
        setComments((prevComments) => {
          if (!prevComments.some(c => c._id === comment._id)) {
            return [...prevComments, comment];
          }
          return prevComments;
        });
      }
    };

    socket.on("getComment", handleNewComment);

    return () => {
      socket.off("getComment", handleNewComment);
    };
  }, [post._id]);

  const likeHandler = async () => {
    try {
      await axios.put(`/posts/${post._id}/like`, { userId: currentUser._id });
    } catch (err) {
      console.error(err);
    }
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const commentHandler = async () => {
    if (newComment) {
      try {
        const res = await axios.post(`/posts/${post._id}/comment`, {
          userId: currentUser._id,
          text: newComment,
        });
        const newCommentData = { 
          ...res.data, 
          username: currentUser.username, 
          profilePicture: currentUser.profilePicture, 
          createdAt: new Date() 
        };
        setComments((prevComments) => [...prevComments, newCommentData]);
        setNewComment("");
        socket.emit("sendComment", { postId: post._id, comment: newCommentData });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const deletePostHandler = async () => {
    try {
      await axios.delete(`/posts/${post._id}`, { data: { userId: currentUser._id } });
      setShowDeleteOption(false);
      onDelete(post._id); // Call onDelete to update Feed state
    } catch (err) {
      console.error(err);
    }
  };
  
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                className="postProfileImg"
                src={user.profilePicture ? PF + user.profilePicture : PF + "No-dp.png"}
                alt=""
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            {currentUser._id === post.userId && (
              <>
                <MoreVertIcon onClick={() => setShowDeleteOption(true)} />
                {showDeleteOption && (
                  <div className="deleteOption">
                    <button onClick={deletePostHandler} className='deleteButton'>Delete</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post.desc}</span>
          {post.img && post.img.includes('.mp4') ? (
            <video className="postVideo" controls>
              <source src={PF + post.img} type="video/mp4" />
            </video>
          ) : (
            <img className="postImg" src={PF + post.img} alt="" />
          )}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            {isLiked ? (
              <FavoriteIcon className="likeIcon1" onClick={likeHandler} />
            ) : (
              <FavoriteBorderIcon className="likeIcon2" onClick={likeHandler} />
            )}
            <span className="postLikeCounter">{like} Likes</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{comments.length} Comments</span>
          </div>
        </div>
        <div className="postComments">
          {comments.map((comment) => (
            <div key={comment._id} className="comment">
              <Link to={`/profile/${comment.userId.username}`}>
                <img
                  className="commentProfileImg"
                  src={comment.profilePicture ? PF + comment.profilePicture : PF + "No-dp.png"}
                  alt=""
                />
              </Link>
              <div className="commentText">
                <span className="commentUsername">{comment.userId.username}</span>
                <span className="commentContent">{comment.text}</span>
                <span className="commentDate">{format(comment.createdAt)}</span>
              </div> 
            </div>
          ))}
        </div>
        <div className="postCommentInputContainer">
          <input
            type="text"
            className="commentInput"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button className="commentButton" onClick={commentHandler}>Post</button>
        </div>
      </div>
    </div>
  );
}
  