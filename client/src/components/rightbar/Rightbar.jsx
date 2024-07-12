import "./rightbar.css";
import Online from "../online/Online";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove'; 
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

export default function Rightbar({ user, onlineUsers, setCurrentChat }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [friends, setFriends] = useState([]);
    const { user: currentUser, dispatch } = useContext(AuthContext);
    const [admired, setAdmired] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getFriends = async () => {
            if (user && user._id) {
                try {
                    const friendList = await axios.get("/users/friends/" + user._id);
                    setFriends(friendList.data);
                } catch (err) {
                    console.log(err);
                }
            }
        };
        getFriends();

        setAdmired(currentUser.admiring.includes(user?._id));
    }, [user, currentUser.admiring]);

    const handleClick = async () => {
        try {
            if (admired) {
                await axios.put("/users/" + user._id + "/Disadmire", {
                    userId: currentUser._id
                });
                dispatch({ type: "DISADMIRE", payload: user._id });
            } else {
                await axios.put("/users/" + user._id + "/Admire", { userId: currentUser._id });
                dispatch({ type: "ADMIRE", payload: user._id });
            }
        } catch (err) {
            console.log(err);
        }
        setAdmired(!admired);
    };

    const HomeRightbar = () => {
        const [friends, setFriends] = useState([]);
    
        useEffect(() => {
            const getFriends = async () => {
                try {
                    const friendList = await axios.get("/users/friends/" + currentUser._id);
                    setFriends(friendList.data);
                } catch (err) {
                    console.log(err);
                }
            };
            getFriends();
        }, [currentUser._id]);
    
        return (
            <>
                <a href="https://megamindstechnologies.com/" target="_blank" rel="noopener noreferrer">
                    <img className="rightbarAd" src="/assets/Megaminds.jpg" alt="" />
                </a>
                <h4 className="rightbarTitle">Friends</h4>
                <ul className="rightbarFollowin">
                    {friends.map((friend) => (
                        <Link to={"/profile/" + friend.username} style={{ textDecoration: "none" }} className="link">
                            <div key={friend._id} className="rightbarFollowing">
                                <img
                                    className="rightbarFollowingImg"
                                    src={friend.profilePicture ? PF + friend.profilePicture : PF + "No-dp.png"}
                                    alt=""
                                />
                                <span className="rightbarFollowingName">{friend.username}</span>
                            </div>
                        </Link>
                    ))}
                </ul>
            </>
        );
    };
    
    const ProfileRightbar = () => {
        return (
            <>
                {user.username!== currentUser.username && (
                    <div className="rightbarButtons">
                        <button className="rightbarFollowButton" onClick={handleClick}>
                            {admired? "Disadmire" : "Admire"}
                            {admired? <RemoveIcon /> : <AddIcon />}
                        </button>
                        <button className="rightbarFollowingss" onClick={() => navigate('/messenger')}>
                            Message
                        </button>
                    </div>
                )}

                <h4 className="rightbarTitle">Information</h4>
                <div className="rightbarInfo">
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">City:</span>
                        <span className="rightbarInfoValue">{user.city}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">From:</span>
                        <span className="rightbarInfoValue">{user.from}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">Relationship:</span>
                        <span className="rightbarInfoValue">
                            {user.relationship === 1? "Single" : user.relationship === 2? "Married" : "-"}
                        </span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">Birthday:</span>
                        <span className="rightbarInfoValue">{user.birthday}</span>
                    </div>
                </div>
                
                <h4 className="rightbarTitle">Friends</h4>
                <div className="rightbarFollowings">
                    {friends.map((friend) => (
                        <Link to={"/profile/" + friend.username} style={{ textDecoration: "none" }} className="link">
                            <div key={friend._id} className="rightbarFollowing">
                                <img
                                    className="rightbarFollowingImg"
                                    src={friend.profilePicture? PF + friend.profilePicture : PF + "No-dp.png"}
                                    alt=""
                                />
                                <span className="rightbarFollowingName">{friend.username}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </>
        );
    };

    return (
        <div className="rightbar">
            <div className="rightbarWrapper">
                {user? <ProfileRightbar /> : <HomeRightbar />}
            </div>
        </div>
    );
}