import React, { useState } from 'react';
import classes from './TeamMembers.module.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AccountInfo from '../../UI/AccountInfo/AccountInfo';
import { addMemberIcon } from '../../UI/icons';
import { useDidUpdate } from '../../../utils/customHooks';

const TeamMembers = props => {
  const [filter, setFilter] = useState('');
  const [filteredMembers, setFilteredMembers] = useState([]);

  useDidUpdate(() => {
    setFilteredMembers(props.members.filter(member => member.fullName.includes(filter)));
  }, [filter]);

  const members = filter !== '' ? filteredMembers : props.members;

  return (
    <div className={classes.Container}>
      <div className={classes.MemberMenu}>
        <input className={classes.FilterInput} placeholder="Filter members by name" value={filter} onChange={e => setFilter(e.target.value)} />
        <button className={classes.InviteBtn}>{addMemberIcon} Invite Team Members</button>
      </div>
      <div className={classes.Members}>
        {members.map(member => (
          <div className={classes.Member} key={member.email}>
            <AccountInfo {...member} />
          </div>
        ))}
      </div>
    </div>
  );
};

TeamMembers.propTypes = {
  members: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  members: state.team.members
});

export default connect(mapStateToProps)(TeamMembers);
