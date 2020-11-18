import React, { useEffect, Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import classes from './BoardPage.module.css';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BoardNavBar from '../BoardNavBar/BoardNavBar';
import { initSocket, connectSocket, closeSocket }  from '../../../store/actions/socket';
import { instance as axios } from '../../../axios';
import { addNotif, updateActiveBoard, setCardDetails, updateBoardActivity, setShownMemberActivity } from '../../../store/actions';
import Spinner from '../../UI/Spinner/Spinner';
import ListContainer from '../Lists/ListContainer/ListContainer';
const CardDetails = lazy(() => import('../CardDetails/CardDetails/CardDetails'));
const MemberActivity = lazy(() => import('../MemberActivity/MemberActivity'));

const BoardPage = props => {
  useEffect(() => {
    initSocket(props.match.params.boardID);
    connectSocket();

    return () => {
      console.log('connection closed');
      closeSocket();
    };
  }, [props.match.params.boardID]);

  useEffect(() => {
    const fetchData = async () => {
      const id = props.match.params.boardID;
      try {
        const res = await axios.get('/board/' + id);
        const activity = await axios.get('/activity/recent/board/' + id);
        document.title = res.data.data.title;
        document.body.style.overflow = 'hidden';
        props.updateActiveBoard(res.data.data);
        props.updateBoardActivity(activity.data.activity);
      } catch (err) {
        document.title = 'Brello';
        document.body.style.overflow = 'auto';
        props.addNotif('There was an error while retrieving the board data.');
        props.history.push('/');
      }
    };
    fetchData();
    return () => { document.title = 'Brello'; document.body.style.overflow = 'auto'; }
  }, []);

  const closeDetailsHandler = () => {
    props.history.push(`/board/${props.boardID}`);
    props.hideCardDetails();
  };

  const fallback = <div className={classes.Fallback}><Spinner /></div>;

  return (
    props.boardID !== props.match.params.boardID ? <Spinner /> :
    <>
    <div className={classes.Container} style={{ background: props.color }}>
      <BoardNavBar />
      <ListContainer />
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
  hideCardDetails: PropTypes.func.isRequired,
  refreshEnabled: PropTypes.bool.isRequired,
  shownMember: PropTypes.object,
  closeMemberActivity: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  color: state.board.color,
  boardID: state.board.boardID,
  shownCardID: state.lists.shownCardID,
  shownListID: state.lists.shownListID,
  refreshEnabled: state.board.refreshEnabled,
  shownMember: state.activity.shownMemberActivity
});

const mapDispatchToProps = dispatch => ({
  addNotif: msg => dispatch(addNotif(msg)),
  updateActiveBoard: data => dispatch(updateActiveBoard(data)),
  hideCardDetails: () => dispatch(setCardDetails(null, null)),
  updateBoardActivity: activity => dispatch(updateBoardActivity(activity)),
  closeMemberActivity: () => dispatch(setShownMemberActivity(null))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BoardPage));
