import React, { useRef, useState, useEffect } from 'react';
import classes from './ListActions.module.css';
import { useModalToggle } from '../../../../utils/customHooks';
import PropTypes from 'prop-types';
import { BackBtn, CloseBtn } from '../../../UI/Buttons/Buttons';
import { copyList } from '../../../../store/actions';
import { connect } from 'react-redux';

const ListActions = props => {
  const modalRef = useRef();
  const inputRef = useRef();
  useModalToggle(true, modalRef, props.close);
  const [showCopyList, setShowCopyList] = useState(false);
  const [copyListTitle, setCopyListTitle] = useState(props.title);

  useEffect(() => { if (showCopyList) { setTimeout(() => inputRef.current.focus(), 200); }}, [showCopyList]);

  const resetState = () => {
    setShowCopyList(false);
    setCopyListTitle(props.title);
  };

  const copyHandler = () => {
    props.copyList(copyListTitle, props.listID, props.boardID);
    props.close();
  };

  const defaultContent = (
    <>
      <div className={classes.Option} onClick={() => setShowCopyList(true)}>Copy list</div>
      <div className={classes.Option}>Archive list</div>
      <div className={classes.Option}>Archive all cards in this list</div>
      <div className={classes.Option}>Move all cards in this list</div>
    </>
  );

  const copyListContent = (
    <div className={classes.CopyContainer}>
      <form onSubmit={copyHandler}>
        <input className={classes.Input} value={copyListTitle} onChange={e => setCopyListTitle(e.target.value)}
        placeholder="Enter list title" ref={inputRef} />
        <button type="submit" disabled={copyListTitle === ''} className={classes.SubmitBtn}>Create List</button>
      </form>
    </div>
  );

  return (
    <div ref={modalRef} className={classes.Container}>
      <div className={classes.Title}>
        <span className={showCopyList ? classes.ShowBackBtn : classes.HideBackBtn}><BackBtn back={resetState} /></span>
        {showCopyList ? 'Copy List' : 'List Actions'}
        <span className={classes.CloseBtn}><CloseBtn close={props.close} /></span></div>
      {showCopyList ? copyListContent : defaultContent}
    </div>
  );
};

ListActions.propTypes = {
  close: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  listID: PropTypes.string.isRequired,
  boardID: PropTypes.string.isRequired
};

const mapDispatchToProps = dispatch => ({
  copyList: (title, listID, boardID) => dispatch(copyList(title, listID, boardID))
});

export default connect(null, mapDispatchToProps)(ListActions);
