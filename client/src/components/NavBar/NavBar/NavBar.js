import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classes from './NavBar.module.css';
import Button, { AccountBtn } from '../../UI/Buttons/Buttons';
import { Link, withRouter } from 'react-router-dom';
import { houseIcon, boardIcon, plusIcon } from '../../UI/icons';
import { connect } from 'react-redux';
import CreateBoard from '../CreateBoard/CreateBoard';
import AccountModal from '../AccountModal/AccountModal';
import BoardMenu from '../BoardMenu/BoardMenu';
import LogoTitle from '../../UI/LogoTitle/LogoTitle';

const NavBar = props => {
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showBoardMenu, setShowBoardMenu] = useState(false);

  return props.location.pathname === '/help' ? null : (
    <div className={classes.NavBar}>
      <div className={classes.Section}>
        <Button><Link to="/">{houseIcon}</Link></Button>
        <Button clicked={() => setShowBoardMenu(true)}>{boardIcon}<span>Boards</span></Button>
      </div>
      <LogoTitle />
      <div className={classes.Section}>
        <Button clicked={() => setShowCreateBoard(true)}>{plusIcon}</Button>
        <AccountBtn clicked={() => setShowAccountModal(true)}>{props.fullName.slice(0, 1)}</AccountBtn>
      </div>
      <CreateBoard show={showCreateBoard} close={() => setShowCreateBoard(false)} />
      <AccountModal show={showAccountModal} close={() => setShowAccountModal(false)} />
      <BoardMenu show={showBoardMenu} close={() => setShowBoardMenu(false)} />
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

export default connect(mapStateToProps)(withRouter(NavBar));
