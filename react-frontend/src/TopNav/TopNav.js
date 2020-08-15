import React, { useContext } from 'react';
import './TopNav.css';
import Dropdown from 'react-bootstrap/Dropdown';
import UserContext from "../UserContext";

function TopNav(props) {
  const {user, setUser} = useContext(UserContext);
  
  return (
    <div id="topnav">
        <a href="/home"><h5 className="home-link">Home</h5></a>

        <h5 className="app-name">Shortest Path</h5>

        { user && <Dropdown className="user-dropdown">
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            {user.username}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="/account">My Account</Dropdown.Item>
            <Dropdown.Item href="#" onClick={() => props.logout(setUser)}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>}
    </div>
  );
}

export default TopNav;