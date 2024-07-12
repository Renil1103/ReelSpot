import axios from "axios";
import "./register.css";
import React, { useRef, useState } from "react";
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";

export default function Register() {
    const username = useRef();
    const email = useRef(); 
    const password = useRef();
    const passwordAgain = useRef();
    const otpRef = useRef(); // reference for OTP input

    const navigate = useNavigate();

    const handleClick = async (e) => {
        e.preventDefault();
        if (passwordAgain.current.value !== password.current.value) {
            passwordAgain.current.setCustomValidity("Passwords don't match");
        } else {
            try {
                await axios.post("/auth/register", {
                    username: username.current.value,
                    email: email.current.value,
                    password: password.current.value,
                }); 
                navigate("/login");
            } catch (err) {
                console.error(err);
            }
        }
    };

    return ( 
        <div className="register">
            <div className="registerWrapper">
                <div className="registerLeft">
                    <div className="registerLogo">
                        <img src="/assets/diaphragm.png" className="Img" alt="Not available" />
                        <span className="Text1">Reel</span>
                        <span className="Text2">Spot</span>
                    </div>
                    <hr className="line" />
                    <span className="registerDesc">Where Connections come Alive.</span>
                    <hr className="line" />
                </div>
                <div className="registerRight">
                    <form className="registerBox" onSubmit={handleClick}>
                        <input placeholder="Username" required ref={username} className="registerInput" />
                        <input placeholder="Email" required ref={email} className="registerInput" type="email" />
                        <input placeholder="Password" required ref={password} className="registerInput" type="password" minLength="6" />
                        <input placeholder="Password Again" required ref={passwordAgain} className="registerInput" type="password" minLength="6" />
                        <center><button className="registerButton" type="submit">Sign Up</button></center>
                        <center><button className="registerLoginButton" onClick={() => navigate("/login")}>Log in to the Account</button></center>
                    </form>
                </div>
                <div className="bottomRightCorner">
                    <footer className="footer"><i>Renil and Samay.</i></footer>
                </div>
            </div>
        </div>
    );
}
