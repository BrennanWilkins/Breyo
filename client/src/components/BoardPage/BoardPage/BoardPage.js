import React, { useState, useEffect, Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import classes from './BoardPage.module.css';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BoardNavBar from '../BoardNavBar/BoardNavBar';
import { initSocket, connectSocket, closeSocket }  from '../../../store/actions/socket';
import { instance as axios } from '../../../axios';
import { addNotif, updateActiveBoard, setCardDetails, setShownMemberActivity } from '../../../store/actions';
import Spinner from '../../UI/Spinner/Spinner';
import ListContainer from '../Lists/ListContainer/ListContainer';
const CardDetails = lazy(() => import('../CardDetails/CardDetails/CardDetails'));
const MemberActivity = lazy(() => import('../MemberActivity/MemberActivity'));

const BoardPage = props => {
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    // initalize new socket connection on new board load
    initSocket(props.match.params.boardID);
    connectSocket();

    return () => {
      // close socket connection on navigation away
      console.log('connection closed');
      closeSocket();
    };
  }, [props.match.params.boardID]);

  useEffect(() => {
    const fetchData = async () => {
      const id = props.match.params.boardID;
      try {
        const res = await axios.get('/board/' + id);
        // update document style on success
        document.title = res.data.data.title;
        document.body.style.overflow = 'hidden';
        props.updateActiveBoard(res.data.data);
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

  const closeDetailsHandler = () => {
    props.history.push(`/board/${props.boardID}`);
    props.setCardDetails(null, null);
  };

  useEffect(() => {
    // set card details based on listID & cardID in query params
    const path = props.location.pathname;
    if (!path.includes('/c/') || !path.includes('/l/')) { return; }
    const listID = path.slice(path.indexOf('/l/') + 3, path.indexOf('/c/'));
    const cardID = path.slice(path.indexOf('/c/') + 3);
    props.setCardDetails(cardID, listID);
  }, [props.location.pathname]);

  const fallback = <div className={classes.Fallback}><Spinner /></div>;

  return (
    props.boardID !== props.match.params.boardID ? <Spinner /> :
    <>
    <div className={classes.Container} style={{ background: props.color }}>
      <BoardNavBar showMenu={showMenu} closeMenu={() => setShowMenu(false)} openMenu={() => setShowMenu(true)} />
      <ListContainer showMenu={showMenu} />
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
  closeMemberActivity: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  color: state.board.color,
  boardID: state.board.boardID,
  shownCardID: state.lists.shownCardID,
  shownListID: state.lists.shownListID,
  shownMember: state.activity.shownMemberActivity
});

const mapDispatchToProps = dispatch => ({
  addNotif: msg => dispatch(addNotif(msg)),
  updateActiveBoard: data => dispatch(updateActiveBoard(data)),
  setCardDetails: (cardID, listID) => dispatch(setCardDetails(cardID, listID)),
  closeMemberActivity: () => dispatch(setShownMemberActivity(null))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BoardPage));
