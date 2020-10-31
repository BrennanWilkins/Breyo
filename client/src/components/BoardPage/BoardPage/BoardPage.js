import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classes from './BoardPage.module.css';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BoardNavBar from '../BoardNavBar/BoardNavBar';
import EventSourcePolyfill from 'eventsource';
import { instance as axios } from '../../../axios';
import { addNotif, updateActiveBoard, getBoardData } from '../../../store/actions';
import Spinner from '../../UI/Spinner/Spinner';
import ListContainer from '../Lists/ListContainer/ListContainer';

const BoardPage = props => {
  // UNCOMMENT TO ENABLE EVENT SOURCE
  // useEffect(() => {
  //   const id = props.match.params.boardID;
  //   const url = 'http://localhost:9000/api/board/stream/' + id;
  //   const source = new EventSourcePolyfill(url, { headers: { 'x-auth-token': axios.defaults.headers.common['x-auth-token'] }});
  //
  //   source.onmessage = event => {
  //     console.log('Received stream');
  //     const data = JSON.parse(event.data);
  //     props.updateActiveBoard(data);
  //   };
  //
  //   source.onerror = errMsg => {
  //     console.log('Error: connection closed');
  //     source.close();
  //     props.addNotif('Connection to the server was lost.');
  //   };
  //
  //   return () => {
  //     console.log('Stream closed');
  //     document.title = 'Brello';
  //     document.body.style.overflow = 'auto';
  //     source.close();
  //   };
  // }, [props.match.params.boardID]);

  useEffect(() => {
    const fetchData = async () => {
      const id = props.match.params.boardID;
      try {
        const res = await axios.get('/board/' + id);
        document.title = res.data.data.title;
        document.body.style.overflow = 'hidden';
        props.updateActiveBoard(res.data.data);
      } catch (err) {
        document.title = 'Brello';
        document.body.style.overflow = 'auto';
        props.addNotif('There was an error while retrieving the board data.');
        props.history.push('/');
      }
    };
    fetchData();
  }, []);

  return (
    props.boardID !== props.match.params.boardID ? <Spinner /> :
    <div className={classes.Container} style={{ background: props.color }}>
      <BoardNavBar />
      <ListContainer />
    </div>
  );
};

BoardPage.propTypes = {
  addNotif: PropTypes.func.isRequired,
  updateActiveBoard: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  boardID: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  color: state.board.color,
  boardID: state.board.boardID
});

const mapDispatchToProps = dispatch => ({
  addNotif: msg => dispatch(addNotif(msg)),
  updateActiveBoard: data => dispatch(updateActiveBoard(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BoardPage));
