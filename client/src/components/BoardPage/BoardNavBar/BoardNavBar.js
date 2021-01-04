import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classes from './BoardNavBar.module.css';
import { connect } from 'react-redux';
import { updateBoardTitle, toggleIsStarred, openRoadmap, closeRoadmap } from '../../../store/actions';
import AutosizeInput from 'react-input-autosize';
import Button, { AccountBtn } from '../../UI/Buttons/Buttons';
import { starIcon, dotsIcon, roadmapIcon, boardIcon, adminIcon, teamIcon } from '../../UI/icons';
import InviteModal from '../InviteModal/InviteModal';
import BoardMenu from '../BoardMenu/BoardMenu';
import MemberModal from '../MemberModal/MemberModal';
import { LIGHT_PHOTO_IDS } from '../../../utils/backgrounds';
import QueryCountBtn from '../../UI/QueryCountBtn/QueryCountBtn';
import BoardTeamModal from '../BoardTeamModal/BoardTeamModal';

const BoardNavBar = props => {
  const [inputTitle, setInputTitle] = useState(props.title);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMember, setShowMember] = useState('');
  const [adminCount, setAdminCount] = useState(props.members.filter(member => member.isAdmin).length);
  const [darkenBtns, setDarkenBtns] = useState(false);
  const [darkenBtns2, setDarkenBtns2] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showBoardTeamModal, setShowBoardTeamModal] = useState(false);

  useEffect(() => setAdminCount(props.members.filter(member => member.isAdmin).length), [props.members]);

  useEffect(() => setInputTitle(props.title), [props.title]);

  useEffect(() => {
    // if board background causes btns to be hard to see, add darken class
    if (LIGHT_PHOTO_IDS.includes(props.color)) { setDarkenBtns(true); }
    else { setDarkenBtns(false); }
    if (props.color === LIGHT_PHOTO_IDS[1]) { setDarkenBtns2(true); }
    else { setDarkenBtns2(false); }
  }, [props.color]);

  const checkTitle = () => {
    if (inputTitle === props.title || inputTitle.length > 100 || inputTitle === '') { return setInputTitle(props.title); }
    props.updateTitle(inputTitle, props.boardID);
  };

  const inputTitleHandler = e => {
    if (e.target.value.length > 100) { return; }
    setInputTitle(e.target.value);
  };

  const roadmapHandler = () => {
    if (props.roadmapShown) { props.closeRoadmap(); }
    else { props.openRoadmap(); }
  };

  const openSearchHandler = () => {
    props.openMenu();
    setTimeout(() => {
      setShowSearch(true);
    }, 250);
  };

  return (
    <div className={`${classes.NavBar} ${darkenBtns2 ? classes.DarkenBtns2 : darkenBtns ? classes.DarkenBtns : ''}`}
    style={props.showMenu ? {width: 'calc(100% - 350px)'} : null}>
      <BoardMenu show={props.showMenu} close={props.closeMenu} showSearch={showSearch} setShowSearch={bool => setShowSearch(bool)} />
      <span className={props.showMenu ? `${classes.Input} ${classes.InputContracted}` : classes.Input}>
        <AutosizeInput value={inputTitle} onChange={inputTitleHandler} onBlur={checkTitle} />
      </span>
      <span className={`${classes.StarBtn} ${props.isStarred ? classes.Highlight : ''}`}>
        <Button clicked={() => props.toggleIsStarred(props.boardID)}>{starIcon}</Button>
      </span>
      <span className={classes.Separator}></span>
      {props.members.map(member => (
        <span key={member.email} className={classes.Container}>
          <span className={classes.AccountBtn}>
            <AccountBtn avatar={member.avatar} clicked={() => setShowMember(member.email)} title={member.fullName}>{member.fullName[0]}</AccountBtn>
            {member.isAdmin && <div className={classes.AdminIcon}>{adminIcon}</div>}
          </span>
          {showMember === member.email &&
            <MemberModal close={() => setShowMember('')} fullName={member.fullName} email={member.email} userEmail={props.userEmail}
            isAdmin={member.isAdmin} adminCount={adminCount} userIsAdmin={props.userIsAdmin} boardID={props.boardID} avatar={member.avatar} />}
        </span>
      ))}
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
      <span className={classes.MenuBtns}>
        {props.cardsAreFiltered && <QueryCountBtn openMenu={openSearchHandler} />}
        <span className={`${classes.Btn} ${classes.RoadBtn} ${props.roadmapShown ? classes.RoadBtn2 : ''}`}>
          <Button clicked={roadmapHandler}>{props.roadmapShown ? boardIcon : roadmapIcon}{props.roadmapShown ? 'Board' : 'Roadmaps'}</Button>
        </span>
        {!props.showMenu && <span className={`${classes.Btn} ${classes.MenuBtn}`}><Button clicked={props.openMenu}>{dotsIcon}Menu</Button></span>}
      </span>
    </div>
  );
};

BoardNavBar.propTypes = {
  title: PropTypes.string.isRequired,
  members: PropTypes.array.isRequired,
  boardID: PropTypes.string.isRequired,
  isStarred: PropTypes.bool.isRequired,
  updateTitle: PropTypes.func.isRequired,
  toggleIsStarred: PropTypes.func.isRequired,
  userEmail: PropTypes.string.isRequired,
  userIsAdmin: PropTypes.bool.isRequired,
  showMenu: PropTypes.bool.isRequired,
  openMenu: PropTypes.func.isRequired,
  closeMenu: PropTypes.func.isRequired,
  openRoadmap: PropTypes.func.isRequired,
  closeRoadmap: PropTypes.func.isRequired,
  roadmapShown: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired,
  cardsAreFiltered: PropTypes.bool.isRequired,
  team: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  title: state.board.title,
  members: state.board.members,
  boardID: state.board.boardID,
  isStarred: state.board.isStarred,
  userEmail: state.user.email,
  userIsAdmin: state.board.userIsAdmin,
  roadmapShown: state.board.roadmapShown,
  color: state.board.color,
  cardsAreFiltered: state.lists.cardsAreFiltered,
  team: state.board.team
});

const mapDispatchToProps = dispatch => ({
  updateTitle: (title, id) => dispatch(updateBoardTitle(title, id)),
  toggleIsStarred: boardID => dispatch(toggleIsStarred(boardID)),
  openRoadmap: () => dispatch(openRoadmap()),
  closeRoadmap: () => dispatch(closeRoadmap())
});

export default connect(mapStateToProps, mapDispatchToProps)(BoardNavBar);
