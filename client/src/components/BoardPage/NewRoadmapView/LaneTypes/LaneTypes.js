import React from 'react';
import classes from './LaneTypes.module.css';
import PropTypes from 'prop-types';
import { AccountBtn } from '../../../UI/Buttons/Buttons';
import { plusIcon } from '../../../UI/icons';

const LaneTypes = props => (
  <div className={classes.Container} style={{ minHeight: props.totalHeight }}>
    {
      props.mode === 'List' ?
        props.lanes.map(({ id, height, title, unassignedCards }, i) => (
          <div key={id} style={{ height }} className={classes.Lane}>
            <div className={classes.Title}>
              <div className={classes.TitleText}>{title}</div>
            </div>
            {unassignedCards.length > 0 && <div className={classes.UnassignedBtn}>({unassignedCards.length}) Not Scheduled{plusIcon}</div>}
          </div>
        ))
      : props.mode === 'Member' ?
        props.lanes.map(({ id, height, fullName, avatar, unassignedCards }) => (
          <div key={id} style={{ height }} className={classes.Lane}>
            <div className={classes.Title}>
              <AccountBtn className={classes.Avatar} avatar={avatar}>{fullName ? fullName[0] : ''}</AccountBtn>
              <div className={classes.TitleText}>{fullName}</div>
            </div>
            {unassignedCards.length > 0 && <div className={classes.UnassignedBtn}>({unassignedCards.length}) Not Scheduled{plusIcon}</div>}
          </div>
        ))
      :
        props.lanes.map(({ id, height, color, title, unassignedCards }) => (
          <div key={id} style={{ height }} className={classes.Lane}>
            <div className={classes.Title}>
              <div className={classes.Label} style={{ background: color || null }} />
              <div className={classes.TitleText}>{title}</div>
            </div>
            {unassignedCards.length > 0 && <div className={classes.UnassignedBtn}>({unassignedCards.length}) Not Scheduled{plusIcon}</div>}
          </div>
        ))
    }
  </div>
);

LaneTypes.propTypes = {
  mode: PropTypes.string.isRequired,
  lanes: PropTypes.array.isRequired,
  totalHeight: PropTypes.string.isRequired
};

export default LaneTypes;
