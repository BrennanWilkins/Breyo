import React, { useState, useEffect, Suspense, lazy, useCallback } from 'react';
import PropTypes from 'prop-types';
import classes from './BoardPage.module.css';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BoardNavBar from '../BoardNavBar/BoardNavBar';
import { initSocket, connectSocket, closeSocket }  from '../../../store/actions/socket';
import { instance as axios } from '../../../axios';
import { addNotif, updateActiveBoard, setCardDetails, setShownMemberActivity,
  setCardDetailsInitial, setShownBoardView } from '../../../store/actions';
import Spinner from '../../UI/Spinner/Spinner';
import ListContainer from '../Lists/ListContainer/ListContainer';
import { useDidUpdate } from '../../../utils/customHooks';
import { pathIsValid, getIDs } from '../../../utils/routerUtils';
import { getPhotoURL } from '../../../utils/backgrounds';
const CardDetails = lazy(() => import('../CardDetails/CardDetails/CardDetails'));
const MemberActivity = lazy(() => import('../MemberActivity/MemberActivity'));
const RoadmapContainer = lazy(() => import('../RoadmapView/RoadmapContainer/RoadmapContainer'));
const BoardOverview = lazy(() => import('../BoardOverview/BoardOverview'));

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

  const invalidLinkHandler = () => props.history.push(`/board/${props.match.params.boardID}`);

  const cardDetailsInitialHandler = () => {
    // set initial card details on page load/refresh based on listID & cardID in pathname
    const path = props.location.pathname;
    if (path === `/board/${props.match.params.boardID}` || path === '/') { return; }
    // validate pathname before setting card details, if invalid then push history back to default
    if (!pathIsValid(path)) { return invalidLinkHandler(); }
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
    return () => {
      document.title = 'Breyo';
      document.body.style.overflow = 'auto';
      props.resetView();
    }
  }, [props.match.params.boardID]);

  const closeDetailsHandler = () => {
    props.setCardDetails(null, null);
    props.history.push(`/board/${props.match.params.boardID}`);
  };

  useDidUpdate(() => cardDetailsHandler(), [props.location.pathname]);

  const showMenuHandler = useCallback(bool => setShowMenu(bool), [setShowMenu]);

  const fallback = <div className={classes.Fallback}><Spinner /></div>;

  return (
    props.boardID !== props.match.params.boardID ? <Spinner /> :
    <>
    <div className={classes.Container} style={props.color[0] === '#' ? { background: props.color } :
    { backgroundImage: getPhotoURL(props.color, 1280, 1280) }}>
      <BoardNavBar menuShown={showMenu} toggleMenu={showMenuHandler} />
      {
        props.shownView === 'lists' ? <ListContainer menuShown={showMenu} /> :
        props.shownView === 'roadmap' ? <Suspense fallback=""><RoadmapContainer menuShown={showMenu} /></Suspense> :
        <Suspense fallback=""><BoardOverview menuShown={showMenu} /></Suspense>
      }
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
  shownView: PropTypes.string.isRequired,
  resetView: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  color: state.board.color,
  boardID: state.board.boardID,
  shownCardID: state.lists.shownCardID,
  shownListID: state.lists.shownListID,
  shownMember: state.activity.shownMemberActivity,
  shownView: state.board.shownView
});

const mapDispatchToProps = dispatch => ({
  addNotif: msg => dispatch(addNotif(msg)),
  updateActiveBoard: data => dispatch(updateActiveBoard(data)),
  setCardDetails: (cardID, listID) => dispatch(setCardDetails(cardID, listID)),
  setCardDetailsInitial: (cardID, listID, push) => dispatch(setCardDetailsInitial(cardID, listID, push)),
  closeMemberActivity: () => dispatch(setShownMemberActivity(null)),
  resetView: () => dispatch(setShownBoardView('lists'))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BoardPage));
