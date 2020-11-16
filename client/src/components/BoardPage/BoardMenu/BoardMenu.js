import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import classes from './BoardMenu.module.css';
import { CloseBtn, BackBtn } from '../../UI/Buttons/Buttons';
import { connect } from 'react-redux';
import { boardIcon, activityIcon, settingsIcon, archiveFillIcon } from '../../UI/icons';
import Archive from './Archive/Archive';
import Action from '../CardDetails/CardActivity/Action/Action';
import AboutMenu from './AboutMenu/AboutMenu';
import SettingsMenu from './SettingsMenu/SettingsMenu';
import BackgroundMenu from './BackgroundMenu/BackgroundMenu';
import ActivityMenu from './ActivityMenu/ActivityMenu';

const BoardMenu = props => {
  const [showBoardDesc, setShowBoardDesc] = useState(false);
  const [showChangeBackground, setShowChangeBackground] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [showArchive, setShowArchive] = useState(false);

  const resetState = () => {
    setShowChangeBackground(false);
    setShowBoardDesc(false);
    setShowAllActivity(false);
    setShowSettings(false);
    setShowArchive(false);
  };

  useEffect(() => resetState(), [props.show]);

  const showBackBtn = showChangeBackground || showBoardDesc || showAllActivity || showSettings || showArchive;

  const title = showBoardDesc ? 'About this board' : showChangeBackground ? 'Change Background' :
  showAllActivity ? 'Activity' : showSettings ? 'Board Settings' : showArchive ? 'Archive' : 'Menu';

  const defaultContent = (
    <div>
      <div className={classes.Options}>
        <div onClick={() => setShowBoardDesc(true)} className={classes.Option}>{boardIcon}About this board</div>
        <div onClick={() => setShowChangeBackground(true)} className={classes.Option}>
          <span style={{ background: props.color }} className={classes.SmallColor}></span>Change background
        </div>
        <div onClick={() => setShowSettings(true)} className={classes.Option}><span className={classes.SettingsIcon}>{settingsIcon}</span>Settings</div>
        <div onClick={() => setShowArchive(true)} className={classes.Option}><span className={classes.ArchiveIcon}>{archiveFillIcon}</span>Archive</div>
      </div>
      <div className={classes.Activities}>
        <div onClick={() => setShowAllActivity(true)} className={`${classes.Option} ${classes.ActivityTitle}`}>{activityIcon}Activity</div>
        {props.activity.map(action => (
          <Action key={action._id} isBoard email={action.email} fullName={action.fullName} date={action.date}
          msg={action.boardMsg} cardID={action.cardID} listID={action.listID} boardID={action.boardID} />
        ))}
        <div className={classes.ViewAll} onClick={() => setShowAllActivity(true)}>View all activity...</div>
      </div>
    </div>
  );

  const content = showBoardDesc ? <AboutMenu /> : showChangeBackground ? <BackgroundMenu /> :
  showSettings ? <SettingsMenu /> : showArchive ? <Archive /> : showAllActivity ? <ActivityMenu /> : defaultContent;

  return (
    <div className={props.show ? classes.Menu : `${classes.Menu} ${classes.HideMenu}`}>
      <div className={classes.Title}>
        <span className={showBackBtn ? classes.ShowBackBtn : classes.HideBackBtn}><BackBtn back={resetState} /></span>
        {title}
        <span className={classes.CloseBtn}><CloseBtn close={props.close} /></span>
      </div>
      <div className={title === 'Menu' ? null : classes.Content}>{content}</div>
    </div>
  );
};

BoardMenu.propTypes = {
  show: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  activity: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  color: state.board.color,
  activity: state.activity.boardActivity
});

export default connect(mapStateToProps)(BoardMenu);
