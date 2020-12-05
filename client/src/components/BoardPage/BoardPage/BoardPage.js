import React, { useState, useEffect, Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import classes from './BoardPage.module.css';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BoardNavBar from '../BoardNavBar/BoardNavBar';
import { initSocket, connectSocket, closeSocket }  from '../../../store/actions/socket';
import { instance as axios } from '../../../axios';
import { addNotif, updateActiveBoard, setCardDetails, setShownMemberActivity, setCardDetailsInitial } from '../../../store/actions';
import Spinner from '../../UI/Spinner/Spinner';
import ListContainer from '../Lists/ListContainer/ListContainer';
import { useDidUpdate } from '../../../utils/customHooks';
import { pathIsValid, getIDs } from '../../../utils/routerUtils';
const CardDetails = lazy(() => import('../CardDetails/CardDetails/CardDetails'));
const MemberActivity = lazy(() => import('../MemberActivity/MemberActivity'));
const RoadmapContainer = lazy(() => import('../RoadmapView/RoadmapContainer/RoadmapContainer'));

const BoardPage = props => {
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    // initalize new socket connection on new board load
    initSocket(props.match.params.boardID);
    connectSocket();

    return () => {
      // close socket connection on navigating away
      closeSocket();
    };
  }, [props.match.params.boardID]);

  const cardDetailsHandler = () => {
    // set card details based on listID & cardID in pathname
    const path = props.location.pathname;
    if (path === `/board/${props.boardID}`) { return props.setCardDetails(null, null); }
    const { cardID, listID } = getIDs(path);
    props.setCardDetails(cardID, listID);
  };

  const replaceHistory = () => props.history.replace(`/board/${props.match.params.boardID}`);

  const cardDetailsInitialHandler = () => {
    // set initial card details on page load/refresh based on listID & cardID in pathname
    const path = props.location.pathname;
    if (path === `/board/${props.match.params.boardID}` || path === '/') { return; }
    // validate pathname before setting card details, if invalid then push history back to default
    if (!pathIsValid(path)) { return replaceHistory(); }
    const { cardID, listID } = getIDs(path);
    props.setCardDetailsInitial(cardID, listID, () => closeDetailsHandler());
  };

  useEffect(() => {
    const fetchData = async () => {
      const id = props.match.params.boardID;
      try {
        const res = await axios.get('/board/' + id);
        // update document style on success
        document.title = res.data.data.title;
        document.body.style.overflow = 'hidden';
        props.updateActiveBoard(res.data.data);
        // after page load check if url path has listID/cardID to open by default
        cardDetailsInitialHandler();
      } catch (err) {
        // if error return document style to default & navigate to dashboard
        document.title = 'Breyo';
        document.body.style.overflow = 'auto';
        props.addNotif('There was an error while retrieving the board data.');
        props.history.push('/');
      }
    };
    fetchData();
    return () => { document.title = 'Breyo'; document.body.style.overflow = 'auto'; }
  }, []);

  const closeDetailsHandler = () => props.history.push(`/board/${props.match.params.boardID}`);

  useDidUpdate(() => cardDetailsHandler(), [props.location.pathname]);

  const fallback = <div className={classes.Fallback}><Spinner /></div>;

  return (
    props.boardID !== props.match.params.boardID ? <Spinner /> :
    <>
    <div className={classes.Container} style={{ background: props.color }}>
      <BoardNavBar showMenu={showMenu} closeMenu={() => setShowMenu(false)} openMenu={() => setShowMenu(true)} />
      {props.roadmapShown ? <Suspense fallback=""><RoadmapContainer showMenu={showMenu} /></Suspense> : <ListContainer showMenu={showMenu} />}
    </div>
    {props.shownCardID !== null && props.shownListID !== null &&
      <Suspense fallback={fallback}><CardDetails close={closeDetailsHandler} cardID={props.shownCardID} listID={props.shownListID} /></Suspense>}
    {props.shownMember &&
      <Suspense fallback={fallback}>
        <MemberActivity close={props.closeMemberActivity} email={props.shownMember.email} fullName={props.shownMember.fullName}
          boardID={props.boardID} path={props.location.pathname} />
      </Suspense>}
    </>
  );
};

BoardPage.propTypes = {
  addNotif: PropTypes.func.isRequired,
  updateActiveBoard: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  boardID: PropTypes.string.isRequired,
  setCardDetails: PropTypes.func.isRequired,
  shownMember: PropTypes.object,
  closeMemberActivity: PropTypes.func.isRequired,
  setCardDetailsInitial: PropTypes.func.isRequired,
  shownCardID: PropTypes.string,
  shownListID: PropTypes.string,
  roadmapShown: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  color: state.board.color,
  boardID: state.board.boardID,
  shownCardID: state.lists.shownCardID,
  shownListID: state.lists.shownListID,
  shownMember: state.activity.shownMemberActivity,
  roadmapShown: state.board.roadmapShown
});

const mapDispatchToProps = dispatch => ({
  addNotif: msg => dispatch(addNotif(msg)),
  updateActiveBoard: data => dispatch(updateActiveBoard(data)),
  setCardDetails: (cardID, listID) => dispatch(setCardDetails(cardID, listID)),
  setCardDetailsInitial: (cardID, listID, push) => dispatch(setCardDetailsInitial(cardID, listID, push)),
  closeMemberActivity: () => dispatch(setShownMemberActivity(null))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BoardPage));
