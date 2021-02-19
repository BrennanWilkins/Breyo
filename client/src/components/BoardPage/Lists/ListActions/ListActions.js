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
import ListLimit from './ListLimit';

const ListActions = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);
  const [shownView, setShownView] = useState('');
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);

  useLayoutEffect(() => {
    // set position before mounting to screen to prevent flickering
    setTop(props.top);
    setLeft(props.left);
  }, [props.top, props.left]);

  const archiveAllHandler = () => {
    props.archiveAllCards(props.listID);
    props.close();
  };

  const defaultContent = (
    <>
      <div className={classes.Option} onClick={() => props.openRoadmapList(props.listID)}>{roadmapIcon} Roadmap</div>
      <div className={classes.Option} onClick={() => props.toggleVoting(props.listID)}>{props.isVoting ? 'Close voting on this list' : 'Start a vote on this list'}</div>
      <div className={classes.Option} onClick={() => setShownView('copy')}>Copy list</div>
      <div className={classes.Option} onClick={() => setShownView('limit')}>{props.limit ? 'Set the card limit on this list' : 'Add a card limit to this list'}</div>
      <div className={classes.Sep} />
      <div className={classes.Option} onClick={archiveAllHandler}>Archive all cards in this list</div>
      <div className={classes.Option} onClick={() => setShownView('move')}>Move all cards in this list</div>
      <div className={classes.Sep} />
      <div className={classes.Option} onClick={() => props.archiveList(props.listID)}>Archive list</div>
    </>
  );

  return (
    <div ref={modalRef} className={classes.Container} style={{ left: `${left}px`, top: `${top}px` }}>
      <div className={classes.Title}>
        <span className={shownView ? classes.ShowBackBtn : classes.HideBackBtn}><BackBtn back={() => setShownView('')} /></span>
        {shownView === 'copy' ? 'Copy List' : shownView === 'move' ? 'Move all cards in this list' : shownView === 'limit' ? 'Set List Limit' : 'List Actions'}
        <CloseBtn className={classes.CloseBtn} close={props.close} />
      </div>
      {
        shownView === 'copy' ?
        <CopyList title={props.title} close={props.close} copyList={title => props.copyList(title, props.listID)} /> :
        shownView === 'move' ?
        <MoveCards listID={props.listID} close={props.close} /> :
        shownView === 'limit' ?
        <ListLimit limit={props.limit} listID={props.listID} close={() => setShownView('')} /> :
        defaultContent
      }
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
  toggleVoting: PropTypes.func.isRequired,
  limit: PropTypes.number
};

const mapDispatchToProps = dispatch => ({
  copyList: (title, listID) => dispatch(copyList(title, listID)),
  archiveList: listID => dispatch(archiveList(listID)),
  archiveAllCards: listID => dispatch(archiveAllCards(listID)),
  openRoadmapList: listID => dispatch(openRoadmapList(listID)),
  toggleVoting: listID => dispatch(toggleVoting(listID))
});

export default connect(null, mapDispatchToProps)(ListActions);
