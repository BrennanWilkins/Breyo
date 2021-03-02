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
import RightMenuBtns from './RightMenuBtns';
import AddToTeamModal from '../AddToTeamModal/AddToTeamModal';

const BoardNavBar = props => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [darkMode, setDarkMode] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showBoardTeamModal, setShowBoardTeamModal] = useState(false);
  const [showAddToTeam, setShowAddToTeam] = useState(false);

  useEffect(() => {
    // if board background causes btns to be hard to see, add darken class
    if (props.color === LIGHT_PHOTO_IDS[1]) { setDarkMode('darker'); }
    else if (LIGHT_PHOTO_IDS.includes(props.color)) { setDarkMode('dark'); }
    else { setDarkMode(''); }
  }, [props.color]);

  useEffect(() => {
    if (showAddToTeam) { setShowAddToTeam(false); }
    if (showBoardTeamModal && !props.team.teamID) { setShowBoardTeamModal(false); }
  }, [props.team.teamID]);

  return (
    <div className={`${classes.NavBar} ${darkMode === 'darker' ? classes.DarkenBtns2 : darkMode === 'dark' ? classes.DarkenBtns : ''}`}
    style={props.menuShown ? {width: 'calc(100% - 350px)'} : null}>
      <BoardMenu show={props.menuShown} close={() => props.toggleMenu(false)} showSearch={showSearch} setShowSearch={bool => setShowSearch(bool)} />
      <span className={props.menuShown ? `${classes.Input} ${classes.InputContracted}` : classes.Input}>
        <BoardTitle boardID={props.boardID} />
      </span>
      <Button className={`${classes.StarBtn} ${props.isStarred ? classes.Highlight : ''}`} clicked={() => props.toggleIsStarred(props.boardID)}>{starIcon}</Button>
      <span className={classes.Separator}></span>
      <BoardMembers boardID={props.boardID} />
      <span className={classes.Container}>
        <Button className={classes.Btn} clicked={() => setShowInviteModal(true)}>Invite</Button>
        {showInviteModal && <InviteModal boardID={props.boardID} close={() => setShowInviteModal(false)} />}
      </span>
      <span className={classes.Container}>
        {props.team.teamID ?
          <Button className={`${classes.Btn} ${classes.TeamBtn}`} clicked={() => setShowBoardTeamModal(true)}>{teamIcon}<div>{props.team.title}</div></Button>
          :
          <Button className={classes.Btn} clicked={() => setShowAddToTeam(true)}>Personal</Button>
        }
        {showAddToTeam && <AddToTeamModal close={() => setShowAddToTeam(false)} />}
        {showBoardTeamModal && <BoardTeamModal team={props.team} close={() => setShowBoardTeamModal(false)} />}
      </span>
      <RightMenuBtns menuShown={props.menuShown} openMenu={() => props.toggleMenu(true)} openSearch={() => setShowSearch(true)} />
    </div>
  );
};

BoardNavBar.propTypes = {
  boardID: PropTypes.string.isRequired,
  isStarred: PropTypes.bool.isRequired,
  toggleIsStarred: PropTypes.func.isRequired,
  menuShown: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
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
