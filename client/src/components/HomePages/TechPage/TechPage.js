import React from 'react';
import classes from './TechPage.module.css';
import { sourceCode } from '../../UI/illustrations';
import HomeNav from '../Navs/HomeNav/HomeNav';
import * as icons from './techIcons';

const TechPage = () => (
  <div>
    <HomeNav tech />
    <div className={classes.Illustration}>{sourceCode}</div>
    <div className={classes.Section}>
      <div className={classes.Icon}>{icons.reactIcon}</div>
      <div className={classes.Info}>
        <h2>React</h2>
        <p>The front end code is written in React. Due to the single page nature of React, React router is used to achieve multi-page functionality.
        The package react-beautiful-dnd is used for the drag and drop feature for cards and lists.</p>
      </div>
    </div>
    <div className={classes.Section}>
      <div className={classes.Icon}>{icons.reduxIcon}</div>
      <div className={classes.Info}>
        <h2>Redux</h2>
        <p>Redux is used as a central state container for the React app. All of the data fetching and state updates are handled in redux actions.</p>
      </div>
    </div>
    <div className={classes.Section}>
      <div className={classes.Icon}>{icons.nodeJSIcon}</div>
      <div className={classes.Info}>
        <h2>Node.js</h2>
        <p>Node.js along with the Express.js framework is used for the backend REST API.</p>
      </div>
    </div>
    <div className={classes.Section}>
      <div className={classes.Icon}>{icons.socketIOIcon}</div>
      <div className={classes.Info}>
        <h2>Socket.IO</h2>
        <p>Socket.IO is used to ensure all users' boards stay in sync with other users and devices.
        When a user requests any of the board's API endpoints, an update is sent to all other active users with the new data.</p>
      </div>
    </div>
    <div className={classes.Section}>
      <div className={classes.Icon}>{icons.mongoDBIcon}</div>
      <div className={classes.Info}>
        <h2>MongoDB</h2>
        <p>The NoSQL database MongoDB is used for the database along with mongoose for object data modeling.</p>
      </div>
    </div>
  </div>
);

export default TechPage;
