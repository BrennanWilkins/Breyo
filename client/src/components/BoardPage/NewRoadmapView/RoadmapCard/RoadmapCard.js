import React from 'react';
import classes from './RoadmapCard.module.css';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import { AccountBtn } from '../../../UI/Buttons/Buttons';

const RoadmapCard = props => {
  const history = useHistory();

  const showCardHandler = () => {
    history.push(`/board/${props.boardID}/l/${props.listID}/c/${props.cardID}`);
  };

  return (
    <div style={props.style || null} className={props.className || classes.Card} onClick={showCardHandler}>
      <div className={classes.Title}>{props.title}</div>
      {(!props.style || props.style.width.slice(0, -2) > 175) && <div className={classes.Members}>
        {props.members.slice(0,3).map(member => (
          <AccountBtn key={member.email} avatar={props.avatars[member.email]}>{member.fullName[0]}</AccountBtn>
        ))}
        {props.members.length > 3 && <AccountBtn className={classes.OtherMembers}>+{props.members.length - 3}</AccountBtn>}
      </div>}
    </div>
  );
};

RoadmapCard.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  cardID: PropTypes.string.isRequired,
  listID: PropTypes.string.isRequired,
  boardID: PropTypes.string.isRequired,
  members: PropTypes.array.isRequired,
  avatars: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  avatars: state.board.avatars,
  boardID: state.board.boardID
});

export default connect(mapStateToProps)(RoadmapCard);
