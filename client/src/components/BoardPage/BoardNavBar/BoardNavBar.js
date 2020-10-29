import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classes from './BoardNavBar.module.css';
import { connect } from 'react-redux';
import { updateBoardTitle } from '../../../store/actions';

const BoardNavBar = props => {
  const [inputTitle, setInputTitle] = useState(props.title);

  useEffect(() => setInputTitle(props.title), [props.title]);

  const checkTitle = () => {
    if (inputTitle !== props.title) {
      props.updateTitle(inputTitle, props.boardID);
    }
  };

  return (
    <div>
      <input value={inputTitle} className={classes.Input} onChange={e => setInputTitle(e.target.value)} onBlur={checkTitle} />
    </div>
  );
};

BoardNavBar.propTypes = {
  title: PropTypes.string.isRequired,
  members: PropTypes.array.isRequired,
  activity: PropTypes.array.isRequired,
  boardID: PropTypes.string.isRequired,
  isStarred: PropTypes.bool.isRequired,
  updateTitle: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  title: state.board.title,
  members: state.board.members,
  activity: state.board.activity,
  boardID: state.board.boardID,
  isStarred: state.auth.boards.find(board => board.boardID === state.board.boardID).isStarred
});

const mapDispatchToProps = dispatch => ({
  updateTitle: (title, id) => dispatch(updateBoardTitle(title, id))
});

export default connect(mapStateToProps, mapDispatchToProps)(BoardNavBar);
