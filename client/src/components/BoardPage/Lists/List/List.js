import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classes from './List.module.css';
import { plusIcon, dotsIcon } from '../../../UI/icons';
import TextArea from 'react-textarea-autosize';
import { connect } from 'react-redux';
import { updateListTitle } from '../../../../store/actions';

const List = props => {
  const [titleInput, setTitleInput] = useState(props.title);

  const titleBlurHandler = () => {
    if (titleInput.length === 0 || titleInput.length >= 200) { return setTitleInput(props.title); }
    props.updateListTitle(titleInput, props.listID, props.boardID);
  };

  return (
    <div className={classes.List}>
      <div className={classes.ListTop}>
        <TextArea maxRows="20" value={titleInput} onChange={e => setTitleInput(e.target.value)} className={classes.TitleInput}
        onFocus={e => e.target.select()} onBlur={titleBlurHandler} />
        <div className={classes.CardOptionBtn}>{dotsIcon}</div>
      </div>
      <div className={classes.CardContainer}>
      </div>
      <div className={classes.AddCardBtn}>{plusIcon}{props.cards.length === 0 ? 'Add a card' : 'Add another card'}</div>
    </div>
  );
};

List.propTypes = {
  title: PropTypes.string.isRequired,
  listID: PropTypes.string.isRequired,
  cards: PropTypes.array.isRequired,
  indexInBoard: PropTypes.number.isRequired,
  boardID: PropTypes.string.isRequired
};

const mapDispatchToProps = dispatch => ({
  updateListTitle: (title, listID, boardID) => dispatch(updateListTitle(title, listID, boardID))
});

export default connect(null, mapDispatchToProps)(List);
