import "./login.css";
import React, { useRef, useContext } from "react";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom"; 

export default function Login() {
  const email = useRef();
  const password = useRef();
  const { isFetching, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const response = await loginCall({ email: email.current.value, password: password.current.value }, dispatch);
      if (response.success) {
        
        navigate("/home");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleRegister = () => {
    navigate("/register"); 
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <div className="loginLogo">
            <img src="/assets/diaphragm.png" className="Img" alt="Not available" />
            <span className="Text1">Reel</span>
            <span className="Text2">Spot</span>
          </div>
          <hr className="line" />
          <span className="loginDesc">Where Connections come Alive.</span>
          <hr className="line" />
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input placeholder="Email" type="email" required className="loginInput" ref={email} />
            <input placeholder="Password" type="password" required minLength="6" className="loginInput" ref={password} />
            <center><button type="submit" className="loginButton" disabled={isFetching}>{isFetching ? <CircularProgress color="inherit" size="20px"/> : "Log in"}</button></center>
            <span className="loginForgot">Forgot Password ?</span>
            <center><button className="loginRegisterButton" onClick={handleRegister}>{isFetching ? <CircularProgress color="inherit" size="20px"/> : "Create New Account"}</button></center>
          </form>
        </div>
      </div>
    </div>
  );
}