import "./sidebar.css";
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import ChatIcon from '@mui/icons-material/Chat';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <div className="sidebar">
            <div className="sidebarWrapper">
                <ul className="sidebarList">
                    <li className="sidebarListItem">
                        <DynamicFeedIcon className="sidebarIcon" />
                        <span className="sidebarListItemText">Feed</span>
                    </li>
                    <li className="sidebarListItem">
                        <Link to="/messenger" style={{ textDecoration: "none", color: "inherit" }}>
                            <ChatIcon className="sidebarIcon" />
                            <span className="sidebarListItemText">Chat</span>
                        </Link>
                    </li>
                    <li className="sidebarListItem">
                        <PlayCircleFilledIcon className="sidebarIcon" />
                        <span className="sidebarListItemText">Videos</span>
                    </li>
                    <li className="sidebarListItem">
                        <Diversity1Icon className="sidebarIcon" />
                        <span className="sidebarListItemText">Groups</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
