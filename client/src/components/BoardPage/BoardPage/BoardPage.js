import React, { useEffect, useState, Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import classes from './BoardPage.module.css';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BoardNavBar from '../BoardNavBar/BoardNavBar';
import EventSourcePolyfill from 'eventsource';
import { instance as axios } from '../../../axios';
import { addNotif, updateActiveBoard, getBoardData, setCardDetails, updateBoardActivity } from '../../../store/actions';
import Spinner from '../../UI/Spinner/Spinner';
import ListContainer from '../Lists/ListContainer/ListContainer';
const CardDetails = lazy(() => import('../CardDetails/CardDetails/CardDetails'));

const BoardPage = props => {
  const [windowClosed, setWindowClosed] = useState(false);

  useEffect(() => {
    if (!props.refreshEnabled || windowClosed) { return; }
    console.log('stream opened');
    const id = props.match.params.boardID;
    const url = 'http://localhost:9000/api/board/stream/' + id;
    const source = new EventSourcePolyfill(url, { headers: { 'x-auth-token': axios.defaults.headers.common['x-auth-token'] }});

    source.onmessage = event => {
      console.log('Received stream');
      const data = JSON.parse(event.data);
      props.updateActiveBoard(data);
    };

    source.onerror = errMsg => {
      console.log('Error: connection closed', errMsg);
      source.close();
      props.addNotif('Connection to the server was lost.');
    };

    return () => {
      console.log('Stream closed');
      source.close();
    };
  }, [props.match.params.boardID, props.refreshEnabled, windowClosed]);

  useEffect(() => {
    const visibilityHandler = e => {
      if (document.visibilityState !== 'visible') { setWindowClosed(true); }
      else { setWindowClosed(false); }
    };

    if (props.refreshEnabled) { document.addEventListener('visibilitychange', visibilityHandler); }

    return () => { document.removeEventListener('visibilitychange', visibilityHandler); }
  }, [props.match.params.boardID, props.refreshEnabled]);

  useEffect(() => {
    const fetchData = async () => {
      const id = props.match.params.boardID;
      try {
        const res = await axios.get('/board/' + id);
        const activity = await axios.get('/activity/recent/' + id);
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
    </>
  );
};

BoardPage.propTypes = {
  addNotif: PropTypes.func.isRequired,
  updateActiveBoard: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  boardID: PropTypes.string.isRequired,
  hideCardDetails: PropTypes.func.isRequired,
  refreshEnabled: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  color: state.board.color,
  boardID: state.board.boardID,
  shownCardID: state.lists.shownCardID,
  shownListID: state.lists.shownListID,
  refreshEnabled: state.board.refreshEnabled
});

const mapDispatchToProps = dispatch => ({
  addNotif: msg => dispatch(addNotif(msg)),
  updateActiveBoard: data => dispatch(updateActiveBoard(data)),
  hideCardDetails: () => dispatch(setCardDetails(null, null)),
  updateBoardActivity: activity => dispatch(updateBoardActivity(activity))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BoardPage));
