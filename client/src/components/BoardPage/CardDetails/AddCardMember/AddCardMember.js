import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import classes from './AddCardMember.module.css';
import { CloseBtn, AccountBtn } from '../../../UI/Buttons/Buttons';
import { useModalToggle } from '../../../../utils/customHooks';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { checkIcon } from '../../../UI/icons';
import { addCardMember, removeCardMember } from '../../../../store/actions';

const AddCardMember = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);
  const [boardMembers, setBoardMembers] = useState([]);

  useEffect(() => {
    // add isMember property to props.members before syncing state
    setBoardMembers(props.members.map(member => ({ ...member, isMember: !!props.cardMembers.find(cardMember => cardMember.email === member.email) })));
  }, [props.members, props.cardMembers]);

  useLayoutEffect(() => {
    if (!props.fromList) { return; }
    // if modal is toggled from the card members list then make sure it doesn't overflow screen
    if (modalRef.current.getBoundingClientRect().right + 5 >= window.innerWidth) {
      modalRef.current.style.right = '0';
    } else {
      modalRef.current.style.left = '0';
    }
  }, [props.fromList]);

  const memberHandler = index => {
    if (boardMembers[index].isMember) {
      props.removeCardMember(boardMembers[index].email, props.cardID, props.listID, props.boardID);
    } else {
      props.addCardMember(boardMembers[index].email, boardMembers[index].fullName, props.cardID, props.listID, props.boardID);
    }
  };

  return (
    <div ref={modalRef} className={props.fromList ? classes.FromListContainer : classes.Container}>
      <div className={classes.Title}>Members<span className={classes.CloseBtn}><CloseBtn close={props.close} /></span></div>
      <div className={classes.SubTitle}>BOARD MEMBERS</div>
      {boardMembers.map((member, i) => (
        <div key={member.email} className={classes.Member} onClick={() => memberHandler(i)}>
          <AccountBtn>{member.fullName.slice(0, 1)}</AccountBtn>
          {member.fullName}{member.isMember && checkIcon}
        </div>
      ))}
    </div>
  );
};

AddCardMember.propTypes = {
  close: PropTypes.func.isRequired,
  members: PropTypes.array.isRequired,
  cardMembers: PropTypes.array.isRequired,
  addCardMember: PropTypes.func.isRequired,
  removeCardMember: PropTypes.func.isRequired,
  cardID: PropTypes.string.isRequired,
  listID: PropTypes.string.isRequired,
  boardID: PropTypes.string.isRequired,
  fromList: PropTypes.bool
};

const mapStateToProps = state => ({
  members: state.board.members,
  cardMembers: state.lists.currentCard.members,
  cardID: state.lists.shownCardID,
  listID: state.lists.shownListID,
  boardID: state.board.boardID
});

const mapDispatchToProps = dispatch => ({
  addCardMember: (email, fullName, cardID, listID, boardID) => dispatch(addCardMember(email, fullName, cardID, listID, boardID)),
  removeCardMember: (email, cardID, listID, boardID) => dispatch(removeCardMember(email, cardID, listID, boardID))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddCardMember);
