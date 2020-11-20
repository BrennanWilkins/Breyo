import React, { useState, useRef, useEffect, useMemo } from 'react';
import classes from './CardDesc.module.css';
import PropTypes from 'prop-types';
import { descIcon } from '../../../UI/icons';
import TextArea from 'react-textarea-autosize';
import FormattingModal from '../../FormattingModal/FormattingModal';
import { connect } from 'react-redux';
import Button, { CloseBtn, ActionBtn } from '../../../UI/Buttons/Buttons';
import parseToJSX from '../../../../utils/parseToJSX';
import { updateCardDesc } from '../../../../store/actions';

const CardDesc = props => {
  const [showEdit, setShowEdit] = useState(false);
  const [descInput, setDescInput] = useState(props.currentCard.desc);
  const [showFormattingHelp, setShowFormattingHelp] = useState(false);
  const descRef = useRef();

  useEffect(() => setDescInput(props.currentCard.desc), [props.currentCard.desc]);

  const formattedDesc = useMemo(() => parseToJSX(props.currentCard.desc), [props.currentCard.desc]);

  useEffect(() => {
    if (showEdit) { descRef.current.focus(); }
  }, [showEdit]);

  const saveDescHandler = () => {
    if (descInput.length > 600) { setShowEdit(false); return setDescInput(props.currentCard.desc); }
    props.updateCardDesc(descInput, props.cardID, props.listID, props.boardID);
    setShowEdit(false);
  };

  return (
    <div>
      <div className={classes.Title}>{descIcon}Description{!showEdit && props.currentCard.desc.length > 0 &&
      <span className={classes.EditBtn}><ActionBtn clicked={() => setShowEdit(true)}>Edit</ActionBtn></span>}</div>
      {showEdit ? <>
        <TextArea className={classes.Input} minRows="2" maxRows="50" value={descInput} onChange={e => setDescInput(e.target.value)}
        ref={descRef} placeholder="Add a description for this card" />
        <div className={classes.Btns}>
          <div className={classes.LeftBtns}>
            <span className={classes.SaveBtn}><Button clicked={saveDescHandler} disabled={descInput === props.currentCard.desc}>Save</Button></span>
            <span className={classes.CloseBtn}><CloseBtn close={() => { setShowEdit(false); setDescInput(props.currentCard.desc); }} /></span>
          </div>
          <span className={classes.FormatBtn}><ActionBtn clicked={() => setShowFormattingHelp(true)}>Formatting help</ActionBtn></span>
        </div>
      </> : props.currentCard.desc.length === 0 ?
        <div className={classes.NoDesc} onClick={() => setShowEdit(true)}>Add a description for this card</div>
        : <div className={classes.DescText}>{formattedDesc}</div>}
      {showFormattingHelp && <FormattingModal close={() => setShowFormattingHelp(false)} />}
    </div>
  );
};

CardDesc.propTypes = {
  boardID: PropTypes.string.isRequired,
  listID: PropTypes.string.isRequired,
  cardID: PropTypes.string.isRequired,
  currentCard: PropTypes.object.isRequired,
  updateCardDesc: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  updateCardDesc: (desc, cardID, listID, boardID) => dispatch(updateCardDesc(desc, cardID, listID, boardID))
});

export default connect(null, mapDispatchToProps)(CardDesc);
