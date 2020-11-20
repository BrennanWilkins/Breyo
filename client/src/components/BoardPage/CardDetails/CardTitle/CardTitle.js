import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classes from './CardTitle.module.css';
import { cardIcon } from '../../../UI/icons';
import TextArea from 'react-textarea-autosize';
import { updateCardTitle } from '../../../../store/actions';
import { connect } from 'react-redux';

const CardTitle = props => {
  const [title, setTitle] = useState(props.title);

  useEffect(() => setTitle(props.title), [props.title]);

  const submitHandler = e => {
    e.target.blur();
    if (title === '' || title.length > 200) { return setTitle(props.title); }
    props.updateTitle(title, props.cardID, props.listID, props.boardID);
  };

  const keyPressHandler = e => {
    if (e.key === 'Enter') { e.preventDefault(); submitHandler(e); }
  };

  return (
    <div>
      <div className={classes.Row}>
        <span className={classes.Icon}>{cardIcon}</span>
        <TextArea className={classes.Input} value={title} onChange={e => setTitle(e.target.value)}
        maxRows="10" onKeyPress={keyPressHandler} onBlur={submitHandler} />
      </div>
      <div className={classes.ListTitle}>in list <span>{props.listTitle}</span></div>
    </div>
  );
};

CardTitle.propTypes = {
  title: PropTypes.string.isRequired,
  listTitle: PropTypes.string.isRequired,
  updateTitle: PropTypes.func.isRequired,
  boardID: PropTypes.string.isRequired,
  listID: PropTypes.string.isRequired,
  cardID: PropTypes.string.isRequired
};

const mapDispatchToProps = dispatch => ({
  updateTitle: (title, cardID, listID, boardID) => dispatch(updateCardTitle(title, cardID, listID, boardID))
});

export default connect(null, mapDispatchToProps)(CardTitle);
