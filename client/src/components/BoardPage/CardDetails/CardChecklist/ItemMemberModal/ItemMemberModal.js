import React, { useState, useEffect } from 'react';
import classes from './ItemMemberModal.module.css';
import ModalContainer from '../../../../UI/ModalContainer/ModalContainer';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { AccountBtn, ActionBtn } from '../../../../UI/Buttons/Buttons';
import { checkIcon } from '../../../../UI/icons';
import { changeChecklistItemMember, removeChecklistItemMember } from '../../../../../store/actions';
import { Input } from '../../../../UI/Inputs/Inputs';

const ItemMemberModal = props => {
  const [searchQuery, setSearchQuery] = useState('');
  const [shownMembers, setShownMembers] = useState([]);

  useEffect(() => {
    if (!searchQuery) { setShownMembers(props.currMember ? props.members.filter(({ email }) => email !== props.currMember.email) : props.members); }
    setShownMembers(props.members.filter(member => {
      if (props.currMember?.email === member.email) { return false; }
      return member.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    }));
  }, [searchQuery]);

  const changeMemberHandler = member => {
    props.changeMember({ email: member.email, fullName: member.fullName }, props.itemID, props.checklistID);
    props.close();
  };

  const removeMemberHandler = () => {
    props.removeMember(props.itemID, props.checklistID);
    props.close();
  };

  return (
    <ModalContainer className={classes.Container} title="Assign Member" close={props.close}>
      <Input className={classes.Input} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search board members by name" />
      {!!props.currMember && <>
        <div className={classes.SubTitle}>ASSIGNED MEMBER</div>
        <div className={classes.Member}>
          <AccountBtn avatar={props.avatars[props.currMember.email]}>{props.currMember.fullName[0]}</AccountBtn>
          <div className={classes.Name}>{props.currMember.fullName}</div>
          {checkIcon}
        </div>
      </>}
      <div className={classes.SubTitle}>BOARD MEMBERS</div>
      <div className={classes.Members}>
        {shownMembers.map(member => (
          <div key={member.email} className={classes.Member} onClick={() => changeMemberHandler(member)}>
            <AccountBtn avatar={props.avatars[member.email]}>{member.fullName[0]}</AccountBtn>
            <div className={classes.Name}>{member.fullName}</div>
          </div>
        ))}
      </div>
      <ActionBtn disabled={!props.currMember} clicked={removeMemberHandler} className={classes.RemoveBtn}>Remove Member</ActionBtn>
    </ModalContainer>
  );
};

ItemMemberModal.propTypes = {
  close: PropTypes.func.isRequired,
  itemID: PropTypes.string.isRequired,
  currMember: PropTypes.object,
  checklistID: PropTypes.string.isRequired,
  changeMember: PropTypes.func.isRequired,
  removeMember: PropTypes.func.isRequired,
  members: PropTypes.array.isRequired,
  avatars: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  members: state.board.members,
  avatars: state.board.avatars
});

const mapDispatchToProps = dispatch => ({
  changeMember: (member, itemID, checklistID) => dispatch(changeChecklistItemMember(member, itemID, checklistID)),
  removeMember: (itemID, checklistID) => dispatch(removeChecklistItemMember(itemID, checklistID))
});

export default connect(mapStateToProps, mapDispatchToProps)(ItemMemberModal);
