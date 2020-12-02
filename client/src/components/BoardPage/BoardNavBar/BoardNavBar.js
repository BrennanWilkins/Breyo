import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classes from './BoardNavBar.module.css';
import { connect } from 'react-redux';
import { updateBoardTitle, toggleIsStarred } from '../../../store/actions';
import AutosizeInput from 'react-input-autosize';
import Button, { AccountBtn } from '../../UI/Buttons/Buttons';
import { starIcon, dotsIcon } from '../../UI/icons';
import InviteModal from '../InviteModal/InviteModal';
import BoardMenu from '../BoardMenu/BoardMenu';
import MemberModal from '../MemberModal/MemberModal';

const BoardNavBar = props => {
  const [inputTitle, setInputTitle] = useState(props.title);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMember, setShowMember] = useState('');
  const [adminCount, setAdminCount] = useState(props.members.filter(member => member.isAdmin).length);

  useEffect(() => setAdminCount(props.members.filter(member => member.isAdmin).length), [props.members]);

  useEffect(() => setInputTitle(props.title), [props.title]);

  const checkTitle = () => {
    if (inputTitle === props.title || inputTitle.length > 100 || inputTitle === '') { return setInputTitle(props.title); }
    props.updateTitle(inputTitle, props.boardID);
  };

  const inputTitleHandler = e => {
    if (e.target.value.length > 100) { return; }
    setInputTitle(e.target.value);
  };

  return (
    <div className={classes.NavBar} style={props.showMenu ? {width: 'calc(100% - 350px)'} : null}>
      <BoardMenu show={props.showMenu} close={props.closeMenu} />
      <span className={props.showMenu ? `${classes.Input} ${classes.InputContracted}` : classes.Input}>
        <AutosizeInput value={inputTitle} onChange={inputTitleHandler} onBlur={checkTitle} />
      </span>
      <span className={props.isStarred ? `${classes.StarBtn} ${classes.Highlight}` : classes.StarBtn}>
        <Button clicked={() => props.toggleIsStarred(props.boardID)}>{starIcon}</Button>
      </span>
      <span className={classes.Separator}></span>
      {props.members.map(member => (
        <span key={member.email} className={classes.Container}>
          <span className={classes.AccountBtn}><AccountBtn clicked={() => setShowMember(member.email)}>{member.fullName.slice(0,1)}</AccountBtn></span>
          {showMember === member.email &&
            <MemberModal close={() => setShowMember('')} fullName={member.fullName} email={member.email} userEmail={props.userEmail}
            isAdmin={member.isAdmin} adminCount={adminCount} userIsAdmin={props.userIsAdmin} boardID={props.boardID} />}
        </span>
      ))}
      <span className={classes.Container}>
        <span className={classes.Btn}><Button clicked={() => setShowInviteModal(true)}>Invite</Button></span>
        {showInviteModal && <InviteModal boardID={props.boardID} close={() => setShowInviteModal(false)} />}
      </span>
      {!props.showMenu && <span className={`${classes.Btn} ${classes.MenuBtn}`}><Button clicked={props.openMenu}>{dotsIcon}Menu</Button></span>}
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
  closeMenu: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  title: state.board.title,
  members: state.board.members,
  boardID: state.board.boardID,
  isStarred: state.board.isStarred,
  userEmail: state.auth.email,
  userIsAdmin: state.board.userIsAdmin
});

const mapDispatchToProps = dispatch => ({
  updateTitle: (title, id) => dispatch(updateBoardTitle(title, id)),
  toggleIsStarred: boardID => dispatch(toggleIsStarred(boardID))
});

export default connect(mapStateToProps, mapDispatchToProps)(BoardNavBar);
