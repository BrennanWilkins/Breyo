import React, { useState, useEffect } from 'react';
import classes from './LaneTypes.module.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { AccountBtn } from '../../../UI/Buttons/Buttons';

const LaneTypes = props => {
  const [lanes, setLanes] = useState([]);

  useEffect(() => {
    if (props.mode === 'List') {
      setLanes(props.lists.map(list => (
        <div key={list.listID} className={classes.Lane}>
          <div className={classes.Title}>
            <div className={classes.TitleText}>{list.title}</div>
          </div>
        </div>
      )));
    } else if (props.mode === 'Member') {
      setLanes(props.members.map(member => (
        <div key={member.email} className={classes.Lane}>
          <div className={classes.Title}>
            <AccountBtn className={classes.Avatar} avatar={member.avatar}>{member.fullName[0]}</AccountBtn>
            <div className={classes.TitleText}>{member.fullName}</div>
          </div>
        </div>
      )));
    } else {
      setLanes(props.customLabels.allIDs.map(labelID => (
        <div key={labelID} className={classes.Lane}>
          <div className={classes.Title}>
            <div className={classes.Label} style={{ background: props.customLabels.byID[labelID].color }} />
            <div className={classes.TitleText}>{props.customLabels.byID[labelID].title}</div>
          </div>
        </div>
      )));
    }
  }, [props.mode]);

  return <div className={classes.Container}>{lanes}</div>;
};

LaneTypes.propTypes = {
  mode: PropTypes.string.isRequired,
  lists: PropTypes.array.isRequired,
  members: PropTypes.array.isRequired,
  customLabels: PropTypes.shape({
    allIDs: PropTypes.array.isRequired,
    byID: PropTypes.object.isRequired
  })
};

const mapStateToProps = state => ({
  lists: state.lists.lists,
  members: state.board.members,
  customLabels: state.board.customLabels
});

export default connect(mapStateToProps)(LaneTypes);
