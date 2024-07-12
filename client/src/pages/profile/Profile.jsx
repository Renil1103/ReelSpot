import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const { username } = useParams();
  const [postCount, setPostCount] = useState(0);
  const [profileFile, setProfileFile] = useState(null);
  const [incompleteProfile, setIncompleteProfile] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/users?username=${username}`);
        setUser(res.data);
        fetchPostCount(res.data._id);

        if (!res.data.desc || !res.data.city || !res.data.relationship || !res.data.birthday) {
          setIncompleteProfile(true);
        } else {
          setIncompleteProfile(false);
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };
    fetchUser();
  }, [username]);

  const fetchPostCount = async (userId) => {
    try {
      const res = await axios.get(`/posts/count/${userId}`);
      setPostCount(res.data.count);
    } catch (err) {
      console.error('Failed to fetch post count:', err);
    }
  };

  const handleProfilePictureChange = async () => {
    if (profileFile) {
      const data = new FormData();
      data.append("profilePicture", profileFile);
      data.append("userId", currentUser._id); // Ensure userId is appended

      try {
        const res = await axios.post("/api/uploadProfilePicture", data);
        setUser({...user , profilePicture : res.data.profilePicture});
        setProfileFile(null);
      } catch (err) {
        console.error('Failed to update profile picture:', err);
      }
    }
  };
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={user.coverPicture ? PF + user.coverPicture : PF + "Bg.jpg"}
                alt=""
              />
              <div className="profileUserImgContainer">
                <img
                  className="profileUserImg"
                  src={user.profilePicture ? PF + user.profilePicture : PF + "No-dp.png"}
                  alt=""
                />
                {currentUser.username === username && (
                  <>
                    <input
                      type="file"
                      id="profilePicture"
                      style={{ display: "none" }}
                      accept=".png,.jpeg,.jpg"
                      onChange={(e) => setProfileFile(e.target.files[0])}
                    />
                    <label htmlFor="profilePicture" className="changeProfilePicture">
                      Change Profile Picture 
                    </label>
                  </>
                )}
                {profileFile && (
                  <div className="profileImgPreview">
                    <img className="previewImg" src={URL.createObjectURL(profileFile)} alt="" />
                    <button className="cancelImg" onClick={() => setProfileFile(null)}> Cancel </button>
                    <button className="uploadButton" onClick={handleProfilePictureChange}>
                      Upload
                    </button>
                  </div>
                )}
              </div>
              <div className="profileInfo">
                <h4 className="profileInfoName">{user.username}</h4>
                <span className="profileInfoDesc">{user.desc}</span>
                <div className="profileStats">
                  <span className="profileStatsItem">Posts: {postCount}</span>
                  <span className="profileStatsItem">Admirers: {user.admirersCount}</span>
                  <span className="profileStatsItem">Admiring: {user.admiringCount}</span>
                </div>
              </div>
            </div>
            <div className="profileRightBottom">
              <Feed username={username} />
              <Rightbar user={user} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
