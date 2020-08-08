import React, { useContext } from 'react';
import './TopNav.css';
import { Link } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import UserContext from "../UserContext";

function TopNav(props) {
  const [user, setUser] = useContext(UserContext);

  //Find way to add link with dropdown.item instead to avoid bugs
  const hideDropDown = () => {
    const dropdownRef = document.getElementsByClassName("user-dropdown")[0];
    const dropdownMenuRef = document.getElementsByClassName("dropdown-menu")[0];
    const dropdownToggleRef = document.getElementsByClassName("dropdown-toggle")[0];

    dropdownRef.classList.remove("show");
    dropdownMenuRef.classList.remove("show");
    dropdownToggleRef.setAttribute("aria-expanded", false);
  }
  
  return (
    <div id="topnav">
        <h5 className="app-name">Shortest Path</h5>

        <Dropdown className="user-dropdown">
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            {user && user.username}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Link className="dropdown-item" to="/account" role="button" onClick={() => hideDropDown()}>My Account</Link>
            <Dropdown.Item href="#" onClick={() => props.logout(setUser)}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
    </div>
  );
}

export default TopNav;