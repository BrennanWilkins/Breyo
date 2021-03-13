import React, { useState, useEffect } from 'react';
import classes from './ChangeItemMemberModal.module.css';
import ModalContainer from '../../../../UI/ModalContainer/ModalContainer';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { AccountBtn, ActionBtn } from '../../../../UI/Buttons/Buttons';
import { checkIcon } from '../../../../UI/icons';
import { changeChecklistItemMember, removeChecklistItemMember } from '../../../../../store/actions';
import { Input } from '../../../../UI/Inputs/Inputs';

const ChangeItemMemberModal = props => {
  const [searchQuery, setSearchQuery] = useState('');
  const [shownMembers, setShownMembers] = useState([]);

  useEffect(() => {
    if (!searchQuery) { setShownMembers(props.members); }
    setShownMembers(props.members.filter(member => member.fullName.toLowerCase().includes(searchQuery.toLowerCase())));
  }, [searchQuery]);

  const changeMemberHandler = member => {
    if (member.email === props.currMember) {
      props.removeMember(props.itemID, props.checklistID);
    } else {
      props.changeMember({ email: member.email, fullName: member.fullName }, props.itemID, props.checklistID);
    }
    props.close();
  };

  const removeMemberHandler = () => {
    props.removeMember(props.itemID, props.checklistID);
    props.close();
  };

  return (
    <ModalContainer className={classes.Container} title="Assign Member" close={props.close}>
      <Input className={classes.Input} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search board members by name" />
      <div className={classes.SubTitle}>BOARD MEMBERS</div>
      <div className={classes.Members}>
        {shownMembers.map(member => (
          <div key={member.email} className={classes.Member} onClick={() => changeMemberHandler(member)}>
            <AccountBtn avatar={props.avatars[member.email]}>{member.fullName[0]}</AccountBtn>
            <div className={classes.Name}>{member.fullName}</div>
            {props.currMember === member.email && checkIcon}
          </div>
        ))}
      </div>
      <ActionBtn disabled={!props.currMember} clicked={removeMemberHandler} className={classes.RemoveBtn}>Remove Member</ActionBtn>
    </ModalContainer>
  );
};

ChangeItemMemberModal.propTypes = {
  close: PropTypes.func.isRequired,
  itemID: PropTypes.string.isRequired,
  currMember: PropTypes.string,
  checklistID: PropTypes.string.isRequired,
  changeMember: PropTypes.func.isRequired,
  removeMember: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  members: state.board.members,
  avatars: state.board.avatars
});

const mapDispatchToProps = dispatch => ({
  changeMember: (member, itemID, checklistID) => dispatch(changeChecklistItemMember(member, itemID, checklistID)),
  removeMember: (itemID, checklistID) => dispatch(removeChecklistItemMember(itemID, checklistID))
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangeItemMemberModal);
