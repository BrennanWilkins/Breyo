import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classes from './BoardNavBar.module.css';
import { connect } from 'react-redux';
import { toggleIsStarred } from '../../../store/actions';
import Button from '../../UI/Buttons/Buttons';
import { starIcon, teamIcon } from '../../UI/icons';
import InviteModal from '../InviteModal/InviteModal';
import BoardMenu from '../BoardMenu/BoardMenu';
import { LIGHT_PHOTO_IDS } from '../../../utils/backgrounds';
import BoardTeamModal from '../BoardTeamModal/BoardTeamModal';
import BoardTitle from './BoardTitle';
import BoardMembers from './BoardMembers';
import MenuBtns from './BoardNavBarMenuBtns';

const BoardNavBar = props => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [darkMode, setDarkMode] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showBoardTeamModal, setShowBoardTeamModal] = useState(false);

  useEffect(() => {
    // if board background causes btns to be hard to see, add darken class
    if (props.color === LIGHT_PHOTO_IDS[1]) { setDarkMode('darker'); }
    else if (LIGHT_PHOTO_IDS.includes(props.color)) { setDarkMode('dark'); }
    else { setDarkMode(''); }
  }, [props.color]);

  return (
    <div className={`${classes.NavBar} ${darkMode === 'darker' ? classes.DarkenBtns2 : darkMode === 'dark' ? classes.DarkenBtns : ''}`}
    style={props.showMenu ? {width: 'calc(100% - 350px)'} : null}>
      <BoardMenu show={props.showMenu} close={props.closeMenu} showSearch={showSearch} setShowSearch={bool => setShowSearch(bool)} />
      <span className={props.showMenu ? `${classes.Input} ${classes.InputContracted}` : classes.Input}>
        <BoardTitle boardID={props.boardID} />
      </span>
      <span className={`${classes.StarBtn} ${props.isStarred ? classes.Highlight : ''}`}>
        <Button clicked={() => props.toggleIsStarred(props.boardID)}>{starIcon}</Button>
      </span>
      <span className={classes.Separator}></span>
      <BoardMembers boardID={props.boardID} />
      <span className={classes.Container}>
        <span className={classes.Btn}><Button clicked={() => setShowInviteModal(true)}>Invite</Button></span>
        {showInviteModal && <InviteModal boardID={props.boardID} close={() => setShowInviteModal(false)} />}
      </span>
      <span className={classes.Container}>
        {props.team.teamID && <span className={`${classes.Btn} ${classes.TeamBtn}`}>
          <Button clicked={() => setShowBoardTeamModal(true)}>{teamIcon}<div>{props.team.title}</div></Button>
        </span>}
        {showBoardTeamModal && <BoardTeamModal team={props.team} close={() => setShowBoardTeamModal(false)} />}
      </span>
      <MenuBtns showMenu={props.showMenu} openMenu={props.openMenu} openSearch={() => setShowSearch(true)} />
    </div>
  );
};

BoardNavBar.propTypes = {
  boardID: PropTypes.string.isRequired,
  isStarred: PropTypes.bool.isRequired,
  toggleIsStarred: PropTypes.func.isRequired,
  showMenu: PropTypes.bool.isRequired,
  openMenu: PropTypes.func.isRequired,
  closeMenu: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  team: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  boardID: state.board.boardID,
  isStarred: state.board.isStarred,
  color: state.board.color,
  team: state.board.team
});

const mapDispatchToProps = dispatch => ({
  toggleIsStarred: boardID => dispatch(toggleIsStarred(boardID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BoardNavBar);
