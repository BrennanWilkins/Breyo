import React, { useState, useEffect } from 'react';
import classes from './List.module.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextArea from 'react-textarea-autosize';
import { dotsIcon } from '../../../UI/icons';
import { updateListTitle } from '../../../../store/actions';

const ListTitle = props => {
  const { inputRef, actionsRef } = props.refs;
  const [titleInput, setTitleInput] = useState(props.title);
  const [showTitleInput, setShowTitleInput] = useState(false);

  useEffect(() => setTitleInput(props.title), [props.title]);

  const editTitleHandler = () => {
    if (titleInput === props.title) { return setShowTitleInput(false); }
    if (titleInput.length === 0 || titleInput.length > 200) { setShowTitleInput(false); return setTitleInput(props.title); }
    props.updateListTitle(titleInput, props.listID);
    setShowTitleInput(false);
  };

  return (
    <div className={classes.ListTop}>
      {!showTitleInput ? <div className={classes.ListTitle} onClick={() => setShowTitleInput(true)}>{titleInput}</div> :
      <TextArea maxRows="10" ref={inputRef} value={titleInput} onChange={e => setTitleInput(e.target.value)} className={classes.TitleInput}
      onFocus={e => e.target.select()} autoFocus onBlur={editTitleHandler} onKeyPress={e => { if (e.key === 'Enter') { e.preventDefault(); editTitleHandler(); }}} />}
      {props.limit && <div className={classes.ListLimit}>{props.cardLength} / {props.limit}</div>}
      <div ref={actionsRef} className={classes.ListActionsBtn} onClick={props.showActions}>{dotsIcon}</div>
    </div>
  );
};

ListTitle.propTypes = {
  title: PropTypes.string.isRequired,
  showActions: PropTypes.func.isRequired,
  updateListTitle: PropTypes.func.isRequired,
  refs: PropTypes.object.isRequired,
  listID: PropTypes.string.isRequired,
  limit: PropTypes.number,
  cardLength: PropTypes.number.isRequired
};

const mapDispatchToProps = dispatch => ({
  updateListTitle: (title, listID) => dispatch(updateListTitle(title, listID)),
});

export default connect(null, mapDispatchToProps)(ListTitle);
