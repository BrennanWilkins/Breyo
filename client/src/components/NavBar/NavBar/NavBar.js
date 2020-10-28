import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classes from './NavBar.module.css';
import Button, { AccountBtn } from '../../UI/Buttons/Buttons';
import { Link } from 'react-router-dom';
import { houseIcon, boardIcon, plusIcon } from '../../UI/icons';
import { connect } from 'react-redux';
import CreateBoard from '../CreateBoard/CreateBoard';

const NavBar = props => {
  const [showCreateBoard, setShowCreateBoard] = useState(false);

  return (
    <div className={classes.NavBar}>
      <div className={classes.Section}>
        <Button><Link to="/">{houseIcon}</Link></Button>
        <Button>{boardIcon}<span>Boards</span></Button>
      </div>
      <div className={classes.Title}><Link to="/">Brello</Link></div>
      <div className={classes.Section}>
        <Button clicked={() => setShowCreateBoard(true)}>{plusIcon}</Button>
        <AccountBtn>{props.fullName.slice(0, 1)}</AccountBtn>
      </div>
      <CreateBoard show={showCreateBoard} close={() => setShowCreateBoard(false)} />
      {showCreateBoard && <div className={classes.Backdrop}></div>}
    </div>
  );
};

NavBar.propTypes = {
  fullName: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  fullName: state.auth.fullName
});

export default connect(mapStateToProps)(NavBar);
