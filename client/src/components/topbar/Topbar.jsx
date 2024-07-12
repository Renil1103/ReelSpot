import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Logout } from "../../context/AuthActions";
import SearchIcon from "@mui/icons-material/Search";
import GroupIcon from "@mui/icons-material/Group";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useCallback } from "react";
import "./topbar.css";

const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

export default function Topbar() {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const handleLogout = () => {
    dispatch(Logout());
    navigate("/login");
  };

  const fetchUsers = async (query) => {
    try {
      const res = await axios.get(`/users/search?q=${query}`);
      setSearchResults(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const debouncedFetchUsers = useCallback(debounce(fetchUsers, 300), []);

  useEffect(() => {
    if (searchQuery) {
      debouncedFetchUsers(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, debouncedFetchUsers]);

  const handleEnterPress = (e) => {
    if (e.key === "Enter" && searchResults.length > 0) {
      navigate(`/profile/${searchResults[0].username}`);
    }
  };

  const [friends, setFriends] = useState([]);
  const [showFriendsDropdown, setShowFriendsDropdown] = useState(false);

  const fetchFriends = async () => {
    try {
      const res = await axios.get(`users/friends/${user._id}`);
      setFriends(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleFriendsDropdown = () => {
    setShowFriendsDropdown(!showFriendsDropdown);
    if (!friends.length) {
      fetchFriends();
    }
  };

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">
            <span className="Text1">Reel</span>
            <span className="Text2">Spot</span>
          </span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <SearchIcon className="searchIcon" />
          <input
            placeholder="Search for friend, post or video"
            className="searchInput"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleEnterPress}
          />
          {searchResults.length > 0 && (
            <div className="searchResults">
              {searchResults.map((result) => (
                <Link
                  to={`/profile/${result.username}`}
                  key={result._id}
                  className="searchResultItem"
                  onClick={() => setSearchQuery("")}
                >
                  <img
                    src={
                      result.profilePicture
                        ? PF + result.profilePicture
                        : PF + "No-dp.png"
                    }
                    alt=""
                    className="searchResultImg"
                  />
                  <span>{result.username}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarIcons">
          <div className="topbarIconItem" onClick={toggleFriendsDropdown}>
            <GroupIcon />
            <span className="topbarIconBadge"></span>
            {showFriendsDropdown && (
              <div className="friendsDropdown">
                {friends.map((friend) => (
                  <Link
                    to={`/profile/${friend.username}`}
                    key={friend._id}
                    className="friendItem"
                  >
                    <img
                      src={
                        friend.profilePicture
                          ? PF + friend.profilePicture
                          : PF + "No-dp.png"
                      }
                      alt=""
                      className="friendImg"
                    />
                    <span>{friend.username}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="topbarIconItem">
            <Link to="/messenger" style={{ textDecoration: "none", color: "inherit" }}>
              <ChatIcon />
            </Link>
            <span className="topbarIconBadge"></span>
          </div>
          <div className="topbarIconItem">
                     <span className="topbarIconBadge"></span>
          </div>
        </div>
        <button onClick={handleLogout} className="LogoutButton">
          Logout
        </button>
        <Link to={`/profile/${user.username}`}>
          <img
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "No-dp.png"
            }
            alt=""
            className="topbarImg"
          />
        </Link>
      </div>
    </div>
  );
}