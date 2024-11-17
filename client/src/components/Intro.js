import React from 'react'
import { Link } from "react-router-dom";
import "./Intro.css";

function Intro() {
  return (
    <div className="intro-container">
      <div className="intro-box">
        <div className='welcome'>Welcome to Decentralized Lottery App!</div>
        <Link to='/manager'>
        <button type="button" class="btn btn-primary btn-lg">Manager</button>
        </Link>
        <br></br>
        <br></br>
        <Link to='/players'>
        <button type="button" class="btn btn-primary btn-lg">Player</button>
        </Link>
      </div>
    </div>
  )
}

export default Intro
