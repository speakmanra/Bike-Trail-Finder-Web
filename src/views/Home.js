import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./Home.css";

class Home extends Component {
  render() {
    return (
      <div className='main-header'>
        <div className='title'>
          <h1>Bike Trail Finder</h1>
          <Link to='/findtrails'>
            <button className='ui secondary button'>Find Trails</button>
          </Link>
        </div>
      </div>
    );
  }
}

export default Home;
