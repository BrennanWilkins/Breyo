import React from 'react';
import classes from './HelpPage.module.css';
import HelpNav from '../Navs/HelpNav/HelpNav';

const HelpPage = () => {
  return (
    <div>
      <HelpNav />
      <div className={classes.Content}>
        <div>
          <h2>Creating a board</h2>
        </div>
        <div>
          <h2>Inviting a user to a board</h2>
        </div>
        <div>
          <h2>Creating a list</h2>
        </div>
        <div>
          <h2>Creating a card</h2>
        </div>
        <div>
          <h2>Adding members to a card</h2>
        </div>
        <div>
          <h2>Checklists</h2>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
