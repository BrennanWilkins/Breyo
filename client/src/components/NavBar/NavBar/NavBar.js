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
import CreateMenu from '../CreateMenu/CreateMenu';
import CreateTeam from '../CreateTeam/CreateTeam';

const NavBar = props => {
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showBoardMenu, setShowBoardMenu] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const location = useLocation();

  return location.pathname === '/help' ? null : (
    <div className={classes.NavBar}>
      <div className={classes.Section}>
        <Button><Link to="/">{houseIcon}</Link></Button>
        <Button clicked={() => setShowBoardMenu(true)}>{boardIcon}<span>Boards</span></Button>
      </div>
      <LogoTitle />
      <div className={classes.Section}>
        <Button clicked={() => setShowCreateMenu(true)}>{plusIcon}</Button>
        <AccountBtn avatar={props.avatar} clicked={() => setShowAccountModal(true)}>{props.fullName[0]}</AccountBtn>
      </div>
      {showCreateMenu && <CreateMenu close={() => setShowCreateMenu(false)} openCreateBoard={props.toggleCreateBoard} openCreateTeam={() => setShowCreateTeam(true)} />}
      <CreateBoard show={props.showCreateBoard} close={props.toggleCreateBoard} />
      {showCreateTeam && <CreateTeam close={() => setShowCreateTeam(false)} />}
      <AccountModal show={showAccountModal} close={() => setShowAccountModal(false)} />
      {showBoardMenu && <SearchBoardMenu close={() => setShowBoardMenu(false)} />}
      {(props.showCreateBoard || showCreateTeam) && <div className={classes.Backdrop}></div>}
    </div>
  );
};

NavBar.propTypes = {
  fullName: PropTypes.string.isRequired,
  showCreateBoard: PropTypes.bool.isRequired,
  toggleCreateBoard: PropTypes.func.isRequired,
  avatar: PropTypes.string
};

const mapStateToProps = state => ({
  fullName: state.user.fullName,
  showCreateBoard: state.board.showCreateBoard,
  avatar: state.user.avatar
});

const mapDispatchToProps = dispatch => ({
  toggleCreateBoard: () => dispatch(toggleCreateBoard())
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
