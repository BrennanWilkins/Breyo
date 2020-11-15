import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import classes from './BoardMenu.module.css';
import Button, { CloseBtn, BackBtn, ActionBtn } from '../../UI/Buttons/Buttons';
import { connect } from 'react-redux';
import { boardIcon, activityIcon, checkIcon, settingsIcon, archiveFillIcon } from '../../UI/icons';
import COLORS from '../../../utils/colors';
import { updateColor, updateRefreshEnabled, deleteBoard } from '../../../store/actions';
import { withRouter } from 'react-router-dom';
import Archive from './Archive/Archive';
import Action from '../CardDetails/CardActivity/Action/Action';
import DeleteModal from './DeleteModal/DeleteModal';
import AboutMenu from './AboutMenu/AboutMenu';

const BoardMenu = props => {
  const [showBoardDesc, setShowBoardDesc] = useState(false);
  const [showChangeBackground, setShowChangeBackground] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [showDeleteBoard, setShowDeleteBoard] = useState(false);
  const [showArchive, setShowArchive] = useState(false);

  const resetState = () => {
    setShowChangeBackground(false);
    setShowBoardDesc(false);
    setShowAllActivity(false);
    setShowSettings(false);
    setShowDeleteBoard(false);
    setShowArchive(false);
  };

  useEffect(() => resetState(), [props.show]);

  const deleteBoardHandler = () => {
    props.deleteBoard(props.boardID);
    props.history.push('/');
  };

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
      </div>
    </div>
  );

  const backgroundMenu = (
    <div className={classes.Colors}>
      {COLORS.map(color => (
        <div key={color} onClick={() => props.updateColor(color, props.boardID)} style={{background: color}}>
          {color === props.color && checkIcon}<span></span>
        </div>
      ))}
    </div>
  );

  const settingsMenu = (
    <>
      <div className={classes.RefreshBtn}>
        <ActionBtn clicked={() => props.updateRefreshEnabled(props.boardID)}>{props.refreshEnabled ? 'Disable' : 'Enable'} auto refresh</ActionBtn>
        <div>Disabling auto refresh will cause your board not to automatically update when other members create changes on the board.</div>
      </div>
      <div className={classes.DeleteBoard}>
        <div className={classes.DeleteBtn}><ActionBtn clicked={() => setShowDeleteBoard(true)}>Delete Board</ActionBtn></div>
        {showDeleteBoard && <DeleteModal confirmText="DELETE THIS BOARD" close={() => setShowDeleteBoard(false)}
        delete={deleteBoardHandler} userIsAdmin={props.userIsAdmin} mode="board" />}
      </div>
    </>
  );

  const content = showBoardDesc ? <AboutMenu /> : showChangeBackground ? backgroundMenu : showSettings ? settingsMenu : showArchive ? <Archive /> : defaultContent;

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
  boardID: PropTypes.string.isRequired,
  updateColor: PropTypes.func.isRequired,
  refreshEnabled: PropTypes.bool.isRequired,
  updateRefreshEnabled: PropTypes.func.isRequired,
  userIsAdmin: PropTypes.bool.isRequired,
  deleteBoard: PropTypes.func.isRequired,
  activity: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  color: state.board.color,
  boardID: state.board.boardID,
  userIsAdmin: state.board.userIsAdmin,
  refreshEnabled: state.board.refreshEnabled,
  activity: state.activity.boardActivity
});

const mapDispatchToProps = dispatch => ({
  updateColor: (color, boardID) => dispatch(updateColor(color, boardID)),
  updateRefreshEnabled: boardID => dispatch(updateRefreshEnabled(boardID)),
  deleteBoard: boardID => dispatch(deleteBoard(boardID))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BoardMenu));
