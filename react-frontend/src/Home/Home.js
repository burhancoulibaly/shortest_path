import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div id="home">
      <div className="menu-container">
        <div className="menu">
          <div className="menu-buttons">
            <Link to="/tenpaths">
              <button disabled={true}className="ten-paths btn btn-primary">
                <h1>10 Paths</h1>
              </button>
            </Link>
            <Link to="/sandbox">
              <button className="sandbox btn btn-primary">
                <h1>Sandbox</h1>
              </button>
            </Link>
            <Link to="/multiplayer">
              <button disabled={true} className="multiplayer btn btn-primary">
                <h1>Multiplayer</h1>
              </button>
            </Link>
            10 Paths and Multiplayer pages coming soon
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;