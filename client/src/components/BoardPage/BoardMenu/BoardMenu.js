import React, { useRef, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import classes from './BoardMenu.module.css';
import Button, { CloseBtn, BackBtn, ActionBtn } from '../../UI/Buttons/Buttons';
import { connect } from 'react-redux';
import { boardIcon, activityIcon, checkIcon, personIcon, descIcon, settingsIcon, archiveFillIcon } from '../../UI/icons';
import COLORS from '../../../utils/colors';
import { updateColor, updateBoardDesc, updateRefreshEnabled, deleteBoard } from '../../../store/actions';
import AccountInfo from '../../UI/AccountInfo/AccountInfo';
import TextArea from 'react-textarea-autosize';
import FormattingModal from '../FormattingModal/FormattingModal';
import parseToJSX from '../../../utils/parseToJSX';
import { withRouter } from 'react-router-dom';
import Archive from './Archive/Archive';
import Action from '../CardDetails/CardActivity/Action/Action';
import DeleteModal from './DeleteModal/DeleteModal';

const BoardMenu = props => {
  const [showBoardDesc, setShowBoardDesc] = useState(false);
  const [showChangeBackground, setShowChangeBackground] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [showEditDesc, setShowEditDesc] = useState(false);
  const [showFormattingHelp, setShowFormattingHelp] = useState(false);
  const [descInput, setDescInput] = useState(props.desc);
  const [showDeleteBoard, setShowDeleteBoard] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const descRef = useRef();

  const formattedDesc = useMemo(() => parseToJSX(props.desc), [props.desc]);

  const resetState = () => {
    setShowChangeBackground(false);
    setShowBoardDesc(false);
    setShowAllActivity(false);
    setShowEditDesc(false);
    setDescInput(props.desc);
    setShowFormattingHelp(false);
    setShowSettings(false);
    setShowDeleteBoard(false);
    setShowArchive(false);
  };

  useEffect(() => resetState(), [props.show]);

  useEffect(() => {
    if (showEditDesc) { descRef.current.focus(); }
  }, [showEditDesc]);

  const saveDescHandler = () => {
    props.updateDesc(descInput, props.boardID);
    setShowEditDesc(false);
  };

  const deleteBoardHandler = () => {
    props.deleteBoard(props.boardID);
    props.history.push('/');
  };

  const showBackBtn = showChangeBackground || showBoardDesc || showAllActivity || showSettings || showArchive;

  const title = showBoardDesc ? 'About this board' : showChangeBackground ? 'Change Background' :
  showAllActivity ? 'Activity' : showSettings ? 'Board Settings' : showArchive ? 'Archive' : 'Menu';

  const defaultContent = (
    <><div className={classes.Options}>
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
    </div></>
  );

  const backgroundMenu = (
    <div className={classes.BackgroundMenu}>
      {COLORS.map(color => (
        <div key={color} onClick={() => props.updateColor(color, props.boardID)} style={{background: color}}>
          {color === props.color && checkIcon}<span></span>
        </div>
      ))}
    </div>
  );

  const aboutMenu = (
    <div className={classes.Content}>
      <div className={classes.AboutTitle}>{personIcon}Created by</div>
      <AccountInfo fullName={props.creatorFullName} email={props.creatorEmail} givePadding noBorder />
      <div className={classes.AboutTitle}>{descIcon}Description
        {!showEditDesc && props.desc.length > 0 &&
          <span className={classes.AboutEditBtn}><ActionBtn clicked={() => setShowEditDesc(true)}>Edit</ActionBtn></span>}
      </div>
      {showEditDesc ? <>
        <TextArea className={classes.DescInput} minRows="3" maxRows="50" value={descInput} onChange={e => setDescInput(e.target.value)} ref={descRef} />
        <div className={classes.AboutBtns}>
          <span className={classes.SaveBtn}><Button clicked={saveDescHandler} disabled={descInput === props.desc}>Save</Button></span>
          <span className={classes.AboutCloseBtn}><CloseBtn close={() => { setShowEditDesc(false); setDescInput(props.desc); }} /></span>
          <span className={classes.FormatBtn}><ActionBtn clicked={() => setShowFormattingHelp(true)}>Formatting help</ActionBtn></span>
        </div>
      </> : props.desc.length === 0 ?
        <div className={classes.NoDesc} onClick={() => setShowEditDesc(true)}>
          Add a description to let others know what this board is used for and what they can expect.
        </div>
      : <div className={classes.DescText}>{formattedDesc}</div>}
    </div>
  );

  const settingsMenu = (
    <div className={classes.Content}>
      <div className={classes.RefreshBtn}>
        <ActionBtn clicked={() => props.updateRefreshEnabled(props.boardID)}>{props.refreshEnabled ? 'Disable' : 'Enable'} auto refresh</ActionBtn>
        <div>Disabling auto refresh will cause your board not to automatically update when other members create changes on the board.</div>
      </div>
      <div className={classes.DeleteBoard}>
        <div className={classes.DeleteBtn}><ActionBtn clicked={() => setShowDeleteBoard(true)}>Delete Board</ActionBtn></div>
        {showDeleteBoard && <DeleteModal confirmText="DELETE THIS BOARD" close={() => setShowDeleteBoard(false)}
        delete={deleteBoardHandler} userIsAdmin={props.userIsAdmin} mode="board" />}
      </div>
    </div>
  );

  const archiveMenu = <div className={classes.Content}><Archive /></div>;

  const content = showBoardDesc ? aboutMenu : showChangeBackground ? backgroundMenu : showSettings ? settingsMenu : showArchive ? archiveMenu : defaultContent;

  return (
    <div className={props.show ? classes.Menu : `${classes.Menu} ${classes.HideMenu}`}>
      <div className={classes.Title}>
        <span className={showBackBtn ? classes.ShowBackBtn : classes.HideBackBtn}><BackBtn back={resetState} /></span>
        {title}
        <span className={classes.CloseBtn}><CloseBtn close={props.close} /></span>
      </div>
      {content}
      {showFormattingHelp && <FormattingModal close={() => setShowFormattingHelp(false)} />}
    </div>
  );
};

BoardMenu.propTypes = {
  show: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  boardID: PropTypes.string.isRequired,
  updateColor: PropTypes.func.isRequired,
  creatorEmail: PropTypes.string.isRequired,
  creatorFullName: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  updateDesc: PropTypes.func.isRequired,
  refreshEnabled: PropTypes.bool.isRequired,
  updateRefreshEnabled: PropTypes.func.isRequired,
  userIsAdmin: PropTypes.bool.isRequired,
  deleteBoard: PropTypes.func.isRequired,
  activity: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  color: state.board.color,
  boardID: state.board.boardID,
  creatorEmail: state.board.creatorEmail,
  creatorFullName: state.board.creatorFullName,
  userIsAdmin: state.board.userIsAdmin,
  desc: state.board.desc,
  refreshEnabled: state.board.refreshEnabled,
  activity: state.activity.boardActivity
});

const mapDispatchToProps = dispatch => ({
  updateColor: (color, boardID) => dispatch(updateColor(color, boardID)),
  updateDesc: (desc, boardID) => dispatch(updateBoardDesc(desc, boardID)),
  updateRefreshEnabled: boardID => dispatch(updateRefreshEnabled(boardID)),
  deleteBoard: boardID => dispatch(deleteBoard(boardID))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BoardMenu));
