import React, { useEffect, useState, useContext } from "react";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import "./home.css";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function Home() {
    const [showModal, setShowModal] = useState(false);
    const [city, setCity] = useState("");
    const [from, setFrom] = useState("");
    const [relationship, setRelationship] = useState(1);
    const [birthday, setBirthday] = useState("");
    const [userDetails, setUserDetails] = useState({});
    const [loading, setLoading] = useState(true); // New loading state
    const { user } = useContext(AuthContext);

    useEffect(() => {
        axios.get("/users/getDetails", { params: { userId: user._id } })
            .then((res) => {
                setUserDetails(res.data);
                setLoading(false); // Set loading to false after fetching details
            })
            .catch((error) => {
                console.error("Error fetching user details:", error);
                setLoading(false); // Set loading to false even if there's an error
            });
    }, [user._id]);

    useEffect(() => {
        if (!loading) {
            if (!userDetails.city || !userDetails.from || !userDetails.relationship || !userDetails.birthday) {
                setShowModal(true);
            } else {
                setCity(userDetails.city);
                setFrom(userDetails.from);
                setRelationship(userDetails.relationship);
                setBirthday(userDetails.birthday);
                setShowModal(false);
            }
        }
    }, [userDetails, loading]);

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSaveDetails = async () => {
        try {
            const res = await axios.post(`/users/updateDetails`, {
                userId: user._id,
                city,
                from,
                relationship,
                birthday,
            });

            if (res.data.success) {
                setUserDetails({
                    city,
                    from,
                    relationship,
                    birthday,
                });
                setShowModal(false);
            } else {
                console.error("Failed to update user details:", res.data.message);
            }
        } catch (error) {
            console.error("Error updating user details:", error);
        }
    };

    return (
        <>
            <Topbar />
            <div className="homeContainer">
                <Sidebar />
                <Feed />
                <Rightbar userDetails={userDetails} />
            </div>
            {showModal && (
                <Dialog
                    open={showModal}
                    onClose={handleCloseModal}
                    PaperProps={{
                        style: {
                            backgroundColor: "White",
                            borderRadius: "25px",
                            width: "500px",
                        },
                    }}
                >
                    <DialogTitle className="dialogTitle">ReelSpot</DialogTitle>
                    <DialogContent className="DialogContent">
                        <DialogContentText className="DialogContentText">
                            We need Some additional information about yourself.
                        </DialogContentText>
                        <TextField
                            className="TextField"
                            autoFocus
                            required
                            margin="dense"
                            id="city"
                            name="city"
                            label="City"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                        <TextField
                            className="TextField"
                            required
                            margin="dense"
                            id="from"
                            name="from"
                            label="From"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                        />
                        <TextField
                            className="TextField"
                            required
                            margin="dense"
                            id="relationship"
                            name="relationship"
                            label="Relationship"
                            type="number"
                            fullWidth
                            variant="standard"
                            value={relationship}
                            onChange={(e) => setRelationship(e.target.value)}
                        />
                        <TextField
                            className="TextField"
                            required
                            margin="dense"
                            id="birthday"
                            name="birthday"
                            label="Birthday"
                            type="date"
                            fullWidth
                            variant="standard"
                            value={birthday}
                            onChange={(e) => setBirthday(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModal}>Cancel</Button>
                        <Button onClick={handleSaveDetails}>Save</Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
}
