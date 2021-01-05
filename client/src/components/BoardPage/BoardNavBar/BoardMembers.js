import React, { useState, useEffect } from 'react';
import classes from './BoardNavBar.module.css';
import PropTypes from 'prop-types';
import { AccountBtn } from '../../UI/Buttons/Buttons';
import MemberModal from '../MemberModal/MemberModal';
import { connect } from 'react-redux';

const BoardMembers = props => {
  const [showMember, setShowMember] = useState('');
  const [adminCount, setAdminCount] = useState(props.members.filter(member => member.isAdmin).length);

  useEffect(() => setAdminCount(props.members.filter(member => member.isAdmin).length), [props.members]);

  return props.members.map(member => (
    <span key={member.email} className={classes.Container}>
      <span className={classes.AccountBtn}>
        <AccountBtn isAdmin={member.isAdmin} avatar={member.avatar} clicked={() => setShowMember(member.email)} title={member.fullName}>
          {member.fullName[0]}
        </AccountBtn>
      </span>
      {showMember === member.email &&
        <MemberModal close={() => setShowMember('')} fullName={member.fullName} email={member.email} userEmail={props.userEmail}
        isAdmin={member.isAdmin} adminCount={adminCount} userIsAdmin={props.userIsAdmin} boardID={props.boardID} avatar={member.avatar} />}
    </span>
  ));
};

BoardMembers.propTypes = {
  members: PropTypes.array.isRequired,
  boardID: PropTypes.string.isRequired,
  userIsAdmin: PropTypes.bool.isRequired,
  userEmail: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  members: state.board.members,
  userIsAdmin: state.board.userIsAdmin,
  userEmail: state.user.email
});

export default connect(mapStateToProps)(BoardMembers);
