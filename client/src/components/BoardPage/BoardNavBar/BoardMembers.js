import React, { useState, useEffect } from 'react';
import classes from './BoardNavBar.module.css';
import PropTypes from 'prop-types';
import Button, { AccountBtn } from '../../UI/Buttons/Buttons';
import MemberModal from './MemberModal/MemberModal';
import { connect } from 'react-redux';
import BoardMembersModal from './BoardMembersModal/BoardMembersModal';

const BoardMembers = props => {
  const [shownMember, setShownMember] = useState('');
  const [adminCount, setAdminCount] = useState(0);
  const [members, setMembers] = useState([]);
  const [showExpandBtn, setShowExpandBtn] = useState(false);
  const [showBoardMembers, setShowBoardMembers] = useState(false);

  useEffect(() => {
    setAdminCount(props.members.filter(member => member.isAdmin).length);
    setMembers(props.members.slice(0, 5));
    // show button to view all members if more than 5
    setShowExpandBtn(props.members.length > 5);
  }, [props.members]);

  return (
    <>
      {members.map(member => (
        <span key={member.email} className={classes.Container}>
          <span className={classes.AccountBtn}>
            <AccountBtn isAdmin={member.isAdmin} avatar={member.avatar} clicked={() => setShownMember(member.email)} title={member.fullName}>
              {member.fullName[0]}
            </AccountBtn>
          </span>
          {shownMember === member.email &&
            <MemberModal close={() => setShownMember('')} {...member} adminCount={adminCount} />}
        </span>
      ))}
      <span className={classes.Container}>
        {showExpandBtn && <span className={`${classes.Btn} ${classes.ExpandBtn}`}>
          <Button clicked={() => setShowBoardMembers(true)}>+{props.members.length - 5}</Button>
        </span>}
        {showBoardMembers && <BoardMembersModal members={props.members} close={() => setShowBoardMembers(false)} adminCount={adminCount} />}
      </span>
    </>
  );
};

BoardMembers.propTypes = {
  members: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  members: state.board.members
});

export default connect(mapStateToProps)(BoardMembers);
