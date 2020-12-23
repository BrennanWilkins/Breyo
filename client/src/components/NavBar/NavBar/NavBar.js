import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classes from './NavBar.module.css';
import Button, { AccountBtn } from '../../UI/Buttons/Buttons';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import { houseIcon, boardIcon, plusIcon } from '../../UI/icons';
import { connect } from 'react-redux';
import CreateBoard from '../CreateBoard/CreateBoard';
import AccountModal from '../AccountModal/AccountModal';
import SearchBoardMenu from '../SearchBoardMenu/SearchBoardMenu';
import LogoTitle from '../../UI/LogoTitle/LogoTitle';
import { toggleCreateBoard } from '../../../store/actions';

const NavBar = props => {
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showBoardMenu, setShowBoardMenu] = useState(false);
  const location = useLocation();

  return location.pathname === '/help' ? null : (
    <div className={classes.NavBar}>
      <div className={classes.Section}>
        <Button><Link to="/">{houseIcon}</Link></Button>
        <Button clicked={() => setShowBoardMenu(true)}>{boardIcon}<span>Boards</span></Button>
      </div>
      <LogoTitle />
      <div className={classes.Section}>
        <Button clicked={props.toggleCreateBoard}>{plusIcon}</Button>
        <AccountBtn clicked={() => setShowAccountModal(true)}>{props.fullName.slice(0, 1)}</AccountBtn>
      </div>
      <CreateBoard show={props.showCreateBoard} close={props.toggleCreateBoard} />
      <AccountModal show={showAccountModal} close={() => setShowAccountModal(false)} />
      <SearchBoardMenu show={showBoardMenu} close={() => setShowBoardMenu(false)} />
      {props.showCreateBoard && <div className={classes.Backdrop}></div>}
    </div>
  );
};

NavBar.propTypes = {
  fullName: PropTypes.string.isRequired,
  showCreateBoard: PropTypes.bool.isRequired,
  toggleCreateBoard: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  fullName: state.auth.fullName,
  showCreateBoard: state.board.showCreateBoard
});

const mapDispatchToProps = dispatch => ({
  toggleCreateBoard: () => dispatch(toggleCreateBoard())
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
