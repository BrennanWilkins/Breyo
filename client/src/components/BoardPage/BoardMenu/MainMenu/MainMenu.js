import React, { useMemo } from 'react';
import classes from './MainMenu.module.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Action from '../../../UI/Action/Action';
import CommentAction from '../../../UI/Action/CommentAction';
import { boardIcon, activityIcon, settingsIcon, archiveFillIcon, searchIcon } from '../../../UI/icons';
import { getPhotoURL } from '../../../../utils/backgrounds';

const MainMenu = props => {
  const activities = useMemo(() => (
    props.activity.map(action => {
      if (action.commentID) { return <CommentAction key={action.commentID} {...action} boardID={props.boardID} avatar={props.avatars[action.email]} />; }
      return <Action key={action._id} isBoard email={action.email} fullName={action.fullName} date={action.date}
      msg={action.boardMsg} cardID={action.cardID} listID={action.listID} boardID={action.boardID} avatar={props.avatars[action.email]} />;
    })
  ), [props.activity]);

  return (
    <div>
      <div className={classes.Options}>
        <div onClick={() => props.setViewMode('about')} className={classes.Option}>{boardIcon}About this board</div>
        <div onClick={() => props.setViewMode('background')} className={classes.Option}>
          <span style={props.color[0] === '#' ? { background: props.color } : {backgroundImage: getPhotoURL(props.color, 20) }}
          className={classes.SmallColor}></span>
          Change background
        </div>
        <div onClick={props.showSearch} className={classes.Option}><span className={classes.SettingsIcon}>{searchIcon}</span>Search Cards</div>
        <div onClick={() => props.setViewMode('settings')} className={classes.Option}><span className={classes.SettingsIcon}>{settingsIcon}</span>Settings</div>
        <div onClick={() => props.setViewMode('archive')} className={classes.Option}><span className={classes.ArchiveIcon}>{archiveFillIcon}</span>Archive</div>
      </div>
      <div className={classes.Activities}>
        <div onClick={() => props.setViewMode('activity')} className={`${classes.Option} ${classes.ActivityTitle}`}>{activityIcon}Activity</div>
        {activities}
        <div className={classes.ViewAll} onClick={() => props.setViewMode('activity')}>View all activity...</div>
      </div>
    </div>
  );
};

MainMenu.propTypes = {
  color: PropTypes.string.isRequired,
  showSearch: PropTypes.func.isRequired,
  activity: PropTypes.array.isRequired,
  avatars: PropTypes.object.isRequired,
  boardID: PropTypes.string.isRequired,
  setViewMode: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  color: state.board.color,
  activity: state.activity.boardActivity,
  boardID: state.board.boardID,
  avatars: state.board.avatars
});

export default connect(mapStateToProps)(MainMenu);
