import React from 'react';
import classes from './Card.module.css';
import PropTypes from 'prop-types';
import { AccountBtn } from '../../../UI/Buttons/Buttons';
import { connect } from 'react-redux';

const CardMembers = props => (
  <div className={classes.Members}>
    {props.members.map(member => {
      const avatar = props.avatars[member.email];
      return (
        <div key={member.email} className={classes.Member}>
          <span className={classes.AccountBtn}>
            <AccountBtn isImg={!!avatar} title={member.fullName} clicked={e => props.clickHandler(e, member.email, member.fullName)}>
              {avatar ? <img src={avatar} alt="" /> : member.fullName[0]}
            </AccountBtn>
          </span>
        </div>
      );
    })}
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
