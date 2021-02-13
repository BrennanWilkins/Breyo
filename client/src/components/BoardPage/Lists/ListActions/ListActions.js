import React, { useRef, useState, useLayoutEffect } from 'react';
import classes from './ListActions.module.css';
import { useModalToggle } from '../../../../utils/customHooks';
import PropTypes from 'prop-types';
import { BackBtn, CloseBtn } from '../../../UI/Buttons/Buttons';
import { copyList, archiveList, archiveAllCards, openRoadmapList, toggleVoting } from '../../../../store/actions';
import { connect } from 'react-redux';
import MoveCards from './MoveCards';
import { roadmapIcon } from '../../../UI/icons';
import CopyList from './CopyList';

const ListActions = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);
  const [showCopyList, setShowCopyList] = useState(false);
  const [showMoveCards, setShowMoveCards] = useState(false);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);

  useLayoutEffect(() => {
    // set position before mounting to screen to prevent flickering
    setTop(props.top);
    setLeft(props.left);
  }, [props.top, props.left]);

  const resetState = () => {
    setShowCopyList(false);
    setShowMoveCards(false);
  };

  const archiveAllHandler = () => {
    props.archiveAllCards(props.listID);
    props.close();
  };

  const defaultContent = (
    <>
      <div className={classes.Option} onClick={() => props.openRoadmapList(props.listID)}>{roadmapIcon} Roadmap</div>
      <div className={classes.Option} onClick={() => props.toggleVoting(props.listID)}>{props.isVoting ? 'Close voting on this list' : 'Start a vote on this list'}</div>
      <div className={classes.Option} onClick={() => setShowCopyList(true)}>Copy list</div>
      <div className={classes.Option} onClick={() => props.archiveList(props.listID)}>Archive list</div>
      <div className={classes.Option} onClick={archiveAllHandler}>Archive all cards in this list</div>
      <div className={classes.Option} onClick={() => setShowMoveCards(true)}>Move all cards in this list</div>
    </>
  );

  return (
    <div ref={modalRef} className={classes.Container} style={{ left: `${left}px`, top: `${top}px` }}>
      <div className={classes.Title}>
        <span className={showCopyList || showMoveCards ? classes.ShowBackBtn : classes.HideBackBtn}><BackBtn back={resetState} /></span>
        {showCopyList ? 'Copy List' : showMoveCards ? 'Move all cards in this list' : 'List Actions'}
        <CloseBtn className={classes.CloseBtn} close={props.close} />
      </div>
      {showCopyList ?
        <CopyList title={props.title} close={props.close} copyList={title => props.copyList(title, props.listID)} /> :
        showMoveCards ? <MoveCards listID={props.listID} close={props.close} />
        : defaultContent}
    </div>
  );
};

ListActions.propTypes = {
  close: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  listID: PropTypes.string.isRequired,
  copyList: PropTypes.func.isRequired,
  archiveList: PropTypes.func.isRequired,
  archiveAllCards: PropTypes.func.isRequired,
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  openRoadmapList: PropTypes.func.isRequired,
  isVoting: PropTypes.bool.isRequired,
  toggleVoting: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  copyList: (title, listID) => dispatch(copyList(title, listID)),
  archiveList: listID => dispatch(archiveList(listID)),
  archiveAllCards: listID => dispatch(archiveAllCards(listID)),
  openRoadmapList: listID => dispatch(openRoadmapList(listID)),
  toggleVoting: listID => dispatch(toggleVoting(listID))
});

export default connect(null, mapDispatchToProps)(ListActions);
