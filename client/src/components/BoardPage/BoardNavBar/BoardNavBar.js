import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classes from './BoardNavBar.module.css';
import { connect } from 'react-redux';
import { updateBoardTitle, toggleIsStarred } from '../../../store/actions';
import AutosizeInput from 'react-input-autosize';
import Button, { AccountBtn } from '../../UI/Buttons/Buttons';
import { starIcon, dotsIcon } from '../../UI/icons';
import InviteModal from '../InviteModal/InviteModal';

const BoardNavBar = props => {
  const [inputTitle, setInputTitle] = useState(props.title);
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => setInputTitle(props.title), [props.title]);

  const checkTitle = () => {
    if (inputTitle === props.title || inputTitle.length > 50 || inputTitle === '') { return; }
    props.updateTitle(inputTitle, props.boardID);
  };

  const inputTitleHandler = e => {
    if (e.target.value.length > 50) { return; }
    setInputTitle(e.target.value);
  };

  return (
    <div className={classes.NavBar}>
      <div className={classes.Section}>
        <span className={classes.Input}><AutosizeInput value={inputTitle} onChange={inputTitleHandler} onBlur={checkTitle} /></span>
        <span className={props.isStarred ? `${classes.StarBtn} ${classes.Highlight}` : classes.StarBtn}>
          <Button clicked={() => props.toggleIsStarred(props.boardID)}>{starIcon}</Button>
        </span>
        <div className={classes.Separator}></div>
        {props.members.map(member => (
          <span key={member.email} className={classes.AccountBtn}><AccountBtn>{member.fullName.slice(0,1)}</AccountBtn></span>
        ))}
        <span className={classes.Invite}>
          <span className={classes.Btn}><Button clicked={() => setShowInviteModal(true)}>Invite</Button></span>
          {showInviteModal && <InviteModal boardID={props.boardID} close={() => setShowInviteModal(false)} />}
        </span>
      </div>
      <div className={classes.Section}>
        <span className={`${classes.Btn} ${classes.MenuBtn}`}><Button>{dotsIcon}Menu</Button></span>
      </div>
    </div>
  );
};

BoardNavBar.propTypes = {
  title: PropTypes.string.isRequired,
  members: PropTypes.array.isRequired,
  activity: PropTypes.array.isRequired,
  boardID: PropTypes.string.isRequired,
  isStarred: PropTypes.bool.isRequired,
  updateTitle: PropTypes.func.isRequired,
  toggleIsStarred: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  title: state.board.title,
  members: state.board.members,
  activity: state.board.activity,
  boardID: state.board.boardID,
  isStarred: state.auth.boards.find(board => board.boardID === state.board.boardID).isStarred
});

const mapDispatchToProps = dispatch => ({
  updateTitle: (title, id) => dispatch(updateBoardTitle(title, id)),
  toggleIsStarred: id => dispatch(toggleIsStarred(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(BoardNavBar);
