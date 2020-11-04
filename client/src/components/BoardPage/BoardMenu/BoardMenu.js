import React, { useRef, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import classes from './BoardMenu.module.css';
import Button, { CloseBtn, BackBtn, ActionBtn } from '../../UI/Buttons/Buttons';
import { useModalToggle } from '../../../utils/customHooks';
import { connect } from 'react-redux';
import { boardIcon, activityIcon, checkIcon, personIcon, descIcon, settingsIcon } from '../../UI/icons';
import COLORS from '../../../utils/colors';
import { updateColor, updateBoardDesc, updateRefreshEnabled, deleteBoard } from '../../../store/actions';
import AccountInfo from '../../UI/AccountInfo/AccountInfo';
import TextArea from 'react-textarea-autosize';
import FormattingModal from '../FormattingModal/FormattingModal';
import parseToJSX from '../../../utils/parseToJSX';
import { withRouter } from 'react-router-dom';

const BoardMenu = props => {
  const [showBoardDesc, setShowBoardDesc] = useState(false);
  const [showChangeBackground, setShowChangeBackground] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [showEditDesc, setShowEditDesc] = useState(false);
  const [showFormattingHelp, setShowFormattingHelp] = useState(false);
  const [descInput, setDescInput] = useState(props.desc);
  const [showDeleteBoard, setShowDeleteBoard] = useState(false);
  const menuRef = useRef();
  const descRef = useRef();
  const deleteRef = useRef();
  useModalToggle(props.show, menuRef, props.close);
  useModalToggle(showDeleteBoard, deleteRef, () => setShowDeleteBoard(false));

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

  const showBackBtn = showChangeBackground || showBoardDesc || showAllActivity || showSettings;
  const title = showBoardDesc ? 'About this board' : showChangeBackground ? 'Change Background' : showAllActivity ? 'Activity' : showSettings ? 'Board Settings' : 'Menu';

  const defaultContent = (
    <><div className={classes.Options}>
      <div onClick={() => setShowBoardDesc(true)} className={classes.Option}>{boardIcon}About this board</div>
      <div onClick={() => setShowChangeBackground(true)} className={classes.Option}>
        <span style={{ background: props.color }} className={classes.SmallColor}></span>Change background
      </div>
      <div onClick={() => setShowSettings(true)} className={classes.Option}><span className={classes.SettingsIcon}>{settingsIcon}</span>Settings</div>
    </div>
    <div className={classes.Activities}>
      <div onClick={() => setShowAllActivity(true)} className={`${classes.Option} ${classes.ActivityTitle}`}>{activityIcon}Activity</div>
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
    <div className={classes.AboutMenu}>
      <div className={classes.AboutTitle}>{personIcon}Created by</div>
      <AccountInfo fullName={props.creatorFullName} email={props.creatorEmail} givePadding noBorder />
      <div className={classes.AboutTitle}>{descIcon}Description
        {!showEditDesc && props.desc.length > 0 &&
          <span className={classes.AboutEditBtn}><ActionBtn clicked={() => setShowEditDesc(true)}>Edit</ActionBtn></span>}
      </div>
      {showEditDesc ? <>
        <TextArea minRows="3" maxRows="50" value={descInput} onChange={e => setDescInput(e.target.value)} ref={descRef} />
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
    <div className={classes.SettingsMenu}>
      <div className={classes.RefreshBtn}>
        <ActionBtn clicked={() => props.updateRefreshEnabled(props.boardID)}>{props.refreshEnabled ? 'Disable' : 'Enable'} auto refresh</ActionBtn>
        <div>Disabling auto refresh will cause your board not to automatically update when other members create changes on the board.</div>
      </div>
      <div className={classes.DeleteBtn}><ActionBtn clicked={() => setShowDeleteBoard(true)}>Delete Board</ActionBtn></div>
      {showDeleteBoard && <div ref={deleteRef} className={classes.DeleteModal}>
        <span className={classes.DeleteCloseBtn}><CloseBtn close={() => setShowDeleteBoard(false)} /></span>
        {props.userIsAdmin ? <>
        <div>Are you sure you want to delete this board? This action cannot be undone.</div>
        <span className={classes.ConfirmDeleteBtn}><ActionBtn clicked={deleteBoardHandler}>DELETE</ActionBtn></span></>
        : <div>You must be an admin to delete this board.</div>}
      </div>}
    </div>
  );

  return (
    <div ref={menuRef} className={props.show ? classes.ShowModal : classes.HideModal}>
      <div className={classes.Title}>
        <span className={showBackBtn ? classes.ShowBackBtn : classes.HideBackBtn}><BackBtn back={resetState} /></span>
        {title}
        <span className={classes.CloseBtn}><CloseBtn close={props.close} /></span>
      </div>
      <div className={classes.Content}>{showBoardDesc ? aboutMenu : showChangeBackground ? backgroundMenu : showSettings ? settingsMenu : defaultContent}</div>
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
  activity: PropTypes.array.isRequired,
  creatorEmail: PropTypes.string.isRequired,
  creatorFullName: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  updateDesc: PropTypes.func.isRequired,
  refreshEnabled: PropTypes.bool.isRequired,
  updateRefreshEnabled: PropTypes.func.isRequired,
  userIsAdmin: PropTypes.bool.isRequired,
  deleteBoard: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  color: state.board.color,
  boardID: state.board.boardID,
  activity: state.board.activity,
  creatorEmail: state.board.creatorEmail,
  creatorFullName: state.board.creatorFullName,
  userIsAdmin: state.board.userIsAdmin,
  desc: state.board.desc,
  refreshEnabled: state.board.refreshEnabled
});

const mapDispatchToProps = dispatch => ({
  updateColor: (color, boardID) => dispatch(updateColor(color, boardID)),
  updateDesc: (desc, boardID) => dispatch(updateBoardDesc(desc, boardID)),
  updateRefreshEnabled: boardID => dispatch(updateRefreshEnabled(boardID)),
  deleteBoard: boardID => dispatch(deleteBoard(boardID))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BoardMenu));
