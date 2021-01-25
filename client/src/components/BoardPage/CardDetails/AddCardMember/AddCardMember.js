import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import classes from './AddCardMember.module.css';
import { AccountBtn } from '../../../UI/Buttons/Buttons';
import { useModalToggle } from '../../../../utils/customHooks';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { checkIcon } from '../../../UI/icons';
import { addCardMember, removeCardMemberCurrentCard } from '../../../../store/actions';
import ModalTitle from '../../../UI/ModalTitle/ModalTitle';
import { Input } from '../../../UI/Inputs/Inputs';

const AddCardMember = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);
  const [boardMembers, setBoardMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMembers, setFilteredMembers] = useState([]);

  useEffect(() => {
    setFilteredMembers(boardMembers.filter(member => member.fullName.toLowerCase().includes(searchQuery.toLowerCase())));
  }, [searchQuery]);

  useEffect(() => {
    // add isMember property to props.members before syncing state
    const members = props.members.map(member => ({ ...member, isMember: !!props.cardMembers.find(cardMember => cardMember.email === member.email) }));
    setBoardMembers(members);
    if (searchQuery) {
      setFilteredMembers(members.filter(member => member.fullName.toLowerCase().includes(searchQuery.toLowerCase())));
    }
  }, [props.members, props.cardMembers]);

  useLayoutEffect(() => {
    if (!props.fromList) { return; }
    // if modal is toggled from the card members list then make sure it doesn't overflow screen
    modalRef.current.style.right = 'auto';
    const rect = modalRef.current.getBoundingClientRect();
    if (rect.right + 5 > window.innerWidth) {
      modalRef.current.style.left = 'auto';
    }
  }, [props.fromList]);

  const memberHandler = index => {
    if (boardMembers[index].isMember) {
      props.removeCardMemberCurrentCard(boardMembers[index].email);
    } else {
      props.addCardMember(boardMembers[index].email, boardMembers[index].fullName);
    }
  };

  const shownMembers = searchQuery ? filteredMembers : boardMembers;

  return (
    <div ref={modalRef} className={`${classes.Modal} ${props.fromList ? classes.FromListContainer : classes.Container}`}>
      <ModalTitle close={props.close} title="Members" />
      <Input className={classes.Input} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search board members by name" />
      <div className={classes.SubTitle}>BOARD MEMBERS</div>
      {shownMembers.map((member, i) => (
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
