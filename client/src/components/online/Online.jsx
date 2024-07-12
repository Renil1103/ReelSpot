import "./online.css";

export default function Online({user}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  if (!user) {
    return null; 
  }

  return (
    <li className="rightbarFriend">
      <div className="rightbarProfileImgContainer">
        <img className="rightbarProfileImg" src={PF + user.profilePicture} alt="" />
        
      </div>
      <span className="rightbarUsername">{user.username}</span>
    </li>
  );
}
