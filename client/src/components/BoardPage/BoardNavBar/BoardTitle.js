import React, { useState, useEffect } from 'react';
import AutosizeInput from 'react-input-autosize';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateBoardTitle } from '../../../store/actions';

const BoardTitle = props => {
  const [inputTitle, setInputTitle] = useState(props.title);

  useEffect(() => setInputTitle(props.title), [props.title]);

  const checkTitle = () => {
    if (inputTitle === props.title || inputTitle.length > 100 || inputTitle === '') { return setInputTitle(props.title); }
    props.updateTitle(inputTitle, props.boardID);
  };

  const inputTitleHandler = e => {
    if (e.target.value.length > 100) { return; }
    setInputTitle(e.target.value);
  };

  return <AutosizeInput value={inputTitle} onChange={inputTitleHandler} onBlur={checkTitle} />;
};

BoardTitle.propTypes = {
  title: PropTypes.string.isRequired,
  boardID: PropTypes.string.isRequired,
  updateTitle: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  title: state.board.title
});

const mapDispatchToProps = dispatch => ({
  updateTitle: (title, boardID) => dispatch(updateBoardTitle(title, boardID))
});

export default connect(mapStateToProps, mapDispatchToProps)(BoardTitle);
