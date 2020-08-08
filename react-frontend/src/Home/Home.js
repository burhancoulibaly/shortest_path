import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div id="home">
      <div className="menu-container">
        <div className="menu-buttons">
          <Link to="/tenpaths">
            <button className="ten-paths btn btn-primary">
              <h1>10 Paths</h1>
            </button>
          </Link>
          <Link to="/sandbox">
            <button className="sandbox btn btn-primary">
              <h1>Sandbox</h1>
            </button>
          </Link>
          <Link to="/multiplayer">
            <button className="multiplayer btn btn-primary">
              <h1>Multiplayer</h1>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;