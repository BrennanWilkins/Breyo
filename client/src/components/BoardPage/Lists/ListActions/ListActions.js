import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import classes from './ListActions.module.css';
import { useModalToggle } from '../../../../utils/customHooks';
import PropTypes from 'prop-types';
import { BackBtn, CloseBtn } from '../../../UI/Buttons/Buttons';
import { copyList, archiveList, archiveAllCards, addNotif } from '../../../../store/actions';
import { connect } from 'react-redux';
import MoveCards from './MoveCards';
import TextArea from 'react-textarea-autosize';

const ListActions = props => {
  const modalRef = useRef();
  const inputRef = useRef();
  useModalToggle(true, modalRef, props.close);
  const [showCopyList, setShowCopyList] = useState(false);
  const [copyListTitle, setCopyListTitle] = useState(props.title);
  const [showMoveCards, setShowMoveCards] = useState(false);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);

  useLayoutEffect(() => {
    // set position before mounting to screen to prevent flickering
    setTop(props.top);
    setLeft(props.left);
  }, [props.top, props.left]);

  useEffect(() => { if (showCopyList) { setTimeout(() => inputRef.current.select(), 200); }}, [showCopyList]);

  const resetState = () => {
    setShowCopyList(false);
    setCopyListTitle(props.title);
    setShowMoveCards(false);
  };

  const copyHandler = e => {
    e.preventDefault();
    if (copyListTitle === '' || copyListTitle.length > 200) { return; }
    props.copyList(copyListTitle, props.listID, props.boardID);
    props.close();
  };

  const archiveAllHandler = () => {
    props.archiveAllCards(props.listID, props.boardID);
    props.close();
  };

  const archiveHandler = () => {
    if (!props.userIsAdmin) { return props.addNotif('You must be an admin to archive lists.'); }
    props.archiveList(props.listID, props.boardID);
  };

  const defaultContent = (
    <>
      <div className={classes.Option} onClick={() => setShowCopyList(true)}>Copy list</div>
      <div className={classes.Option} onClick={archiveHandler}>Archive list</div>
      <div className={classes.Option} onClick={archiveAllHandler}>Archive all cards in this list</div>
      <div className={classes.Option} onClick={() => setShowMoveCards(true)}>Move all cards in this list</div>
    </>
  );

  const copyListContent = (
    <div className={classes.CopyContainer}>
      <form onSubmit={copyHandler}>
        <TextArea className={classes.Input} value={copyListTitle} onChange={e => setCopyListTitle(e.target.value)}
        placeholder="Enter list title" ref={inputRef} minRows="2" maxRows="4" />
        <button type="submit" disabled={copyListTitle === ''} className={classes.SubmitBtn}>Create List</button>
      </form>
    </div>
  );

  return (
    <div ref={modalRef} className={classes.Container} style={{ left: `${left}px`, top: `${top}px` }}>
      <div className={classes.Title}>
        <span className={showCopyList || showMoveCards ? classes.ShowBackBtn : classes.HideBackBtn}><BackBtn back={resetState} /></span>
        {showCopyList ? 'Copy List' : showMoveCards ? 'Move all cards in this list' : 'List Actions'}
        <span className={classes.CloseBtn}><CloseBtn close={props.close} /></span>
      </div>
      {showCopyList ? copyListContent : showMoveCards ? <MoveCards listID={props.listID} boardID={props.boardID} close={props.close} /> : defaultContent}
    </div>
  );
};

ListActions.propTypes = {
  close: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  listID: PropTypes.string.isRequired,
  boardID: PropTypes.string.isRequired,
  copyList: PropTypes.func.isRequired,
  archiveList: PropTypes.func.isRequired,
  archiveAllCards: PropTypes.func.isRequired,
  userIsAdmin: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  userIsAdmin: state.board.userIsAdmin
});

const mapDispatchToProps = dispatch => ({
  copyList: (title, listID, boardID) => dispatch(copyList(title, listID, boardID)),
  archiveList: (listID, boardID) => dispatch(archiveList(listID, boardID)),
  archiveAllCards: (listID, boardID) => dispatch(archiveAllCards(listID, boardID)),
  addNotif: msg => dispatch(addNotif(msg))
});

export default connect(mapStateToProps, mapDispatchToProps)(ListActions);
