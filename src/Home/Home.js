import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div id="home">
      <div className="menu-container">
        <div className="menu">
          <div className="menu-buttons">
            <Link to="/sandbox">
              <button className="sandbox btn btn-primary">
                <h1>Sandbox</h1>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;