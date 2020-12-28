import React from 'react';
import classes from './Card.module.css';
import PropTypes from 'prop-types';
import { AccountBtn } from '../../../UI/Buttons/Buttons';
import { connect } from 'react-redux';

const CardMembers = props => (
  <div className={classes.Members}>
    {props.members.map(member => (
      <div key={member.email} className={classes.Member}>
        <span className={classes.AccountBtn}>
          <AccountBtn avatar={props.avatars[member.email]} title={member.fullName} clicked={e => props.clickHandler(e, member.email, member.fullName)}>
            {member.fullName[0]}
          </AccountBtn>
        </span>
      </div>
    ))}
  </div>
);

CardMembers.propTypes = {
  members: PropTypes.array.isRequired,
  clickHandler: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  avatars: state.board.avatars
});

export default connect(mapStateToProps)(CardMembers);
