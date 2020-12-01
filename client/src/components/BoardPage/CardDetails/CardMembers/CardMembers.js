import React, { useState } from 'react';
import classes from './CardMembers.module.css';
import PropTypes from 'prop-types';
import { AccountBtn } from '../../../UI/Buttons/Buttons';
import { plusIcon } from '../../../UI/icons';
import AddCardMember from '../AddCardMember/AddCardMember';
import CardMemberModal from '../../../UI/CardMemberModal/CardMemberModal';
import { connect } from 'react-redux';

const CardMembers = props => {
  const [showAddMember, setShowAddMember] = useState(false);
  const [shownMember, setShownMember] = useState('');

  return (
    <div className={classes.Container}>
      <div className={classes.Title}>MEMBERS</div>
      {props.members.map(member => (
        <div key={member.email} className={classes.Member}>
          <span className={classes.AccountBtn}><AccountBtn clicked={() => setShownMember(member.email)}>{member.fullName.slice(0, 1)}</AccountBtn></span>
          {shownMember === member.email &&
            <CardMemberModal fullName={member.fullName} email={member.email} close={() => setShownMember('')} />}
        </div>
      ))}
      <span className={classes.AddContainer}>
        <span className={classes.AddBtn}><AccountBtn clicked={() => setShowAddMember(true)}>{plusIcon}</AccountBtn></span>
        {showAddMember && <AddCardMember fromList close={() => setShowAddMember(false)} />}
      </span>
    </div>
  );
};

CardMembers.propTypes = {
  members: PropTypes.array.isRequired
};

export default CardMembers;
