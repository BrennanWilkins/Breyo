import React from 'react';
import classes from './HomePage.module.css';
import { Link } from 'react-router-dom';
import { teamGoals, sharedGoals } from '../../UI/illustrations';
import HomeNav from '../Navs/HomeNav/HomeNav';

const HomePage = () => (
  <div>
    <HomeNav />
    <div className={classes.Main}>
      <h1>Organize, delegate, and plan your team's projects with Breyo.</h1>
      <div className={classes.SignupBtn}><Link to="/signup"><button>SIGN UP FOR FREE</button></Link></div>
      <div className={classes.Illustrations}>
        <div className={classes.Illustration}>{teamGoals}</div>
        <div className={classes.Illustration}>{sharedGoals}</div>
      </div>
    </div>
    <div className={classes.InfoContainer}>
      <div className={classes.Info}>
        <h1>What is Breyo?</h1>
        <p>Breyo provides kanban-style boards, lists, and cards to manage your workflow and tasks.</p>
        <p>It is heavily inspired by the UI/UX and functionality of the popular application Trello, while utilizing a different tech stack and all original source code.</p>
        <Link className={classes.TechLink} to="/tech">Breyo's tech stack</Link>
      </div>
    </div>
  </div>
);

export default HomePage;
