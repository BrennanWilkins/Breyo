import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import classes from './AddCardMember.module.css';
import { AccountBtn } from '../../../UI/Buttons/Buttons';
import { useModalToggle } from '../../../../utils/customHooks';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { checkIcon } from '../../../UI/icons';
import { addCardMember, removeCardMemberCurrentCard } from '../../../../store/actions';
import ModalTitle from '../../../UI/ModalTitle/ModalTitle';

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
      props.removeCardMemberCurrentCard(boardMembers[index].email);
    } else {
      props.addCardMember(boardMembers[index].email, boardMembers[index].fullName);
    }
  };

  return (
    <div ref={modalRef} className={props.fromList ? classes.FromListContainer : classes.Container}>
      <ModalTitle close={props.close} title="Members" />
      <div className={classes.SubTitle}>BOARD MEMBERS</div>
      {boardMembers.map((member, i) => (
        <div key={member.email} className={classes.Member} onClick={() => memberHandler(i)}>
          <AccountBtn avatar={member.avatar}>{member.fullName[0]}</AccountBtn>
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
  removeCardMemberCurrentCard: PropTypes.func.isRequired,
  fromList: PropTypes.bool
};

const mapStateToProps = state => ({
  members: state.board.members,
  cardMembers: state.lists.currentCard.members
});

const mapDispatchToProps = dispatch => ({
  addCardMember: (email, fullName) => dispatch(addCardMember(email, fullName)),
  removeCardMemberCurrentCard: email => dispatch(removeCardMemberCurrentCard(email))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddCardMember);
