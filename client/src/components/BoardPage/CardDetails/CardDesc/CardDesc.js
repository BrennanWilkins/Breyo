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
  const [descInput, setDescInput] = useState(props.currentDesc);
  const [showFormattingHelp, setShowFormattingHelp] = useState(false);
  const descRef = useRef();

  useEffect(() => setDescInput(props.currentDesc), [props.currentDesc]);

  const formattedDesc = useMemo(() => parseToJSX(props.currentDesc), [props.currentDesc]);

  useEffect(() => {
    if (showEdit) { descRef.current.focus(); }
  }, [showEdit]);

  const saveDescHandler = () => {
    if (descInput.length > 600) { setShowEdit(false); return setDescInput(props.currentDesc); }
    props.updateCardDesc(descInput);
    setShowEdit(false);
  };

  return (
    <div>
      <div className={classes.Title}>{descIcon}Description{!showEdit && props.currentDesc.length > 0 &&
      <span className={classes.EditBtn}><ActionBtn clicked={() => setShowEdit(true)}>Edit</ActionBtn></span>}</div>
      {showEdit ? <>
        <TextArea className={classes.Input} minRows="2" maxRows="50" value={descInput} onChange={e => setDescInput(e.target.value)}
        ref={descRef} placeholder="Add a description for this card" />
        <div className={classes.Btns}>
          <div className={classes.LeftBtns}>
            <span className={classes.SaveBtn}><Button clicked={saveDescHandler} disabled={descInput === props.currentDesc}>Save</Button></span>
            <span className={classes.CloseBtn}><CloseBtn close={() => { setShowEdit(false); setDescInput(props.currentDesc); }} /></span>
          </div>
          <span className={classes.FormatBtn}><ActionBtn clicked={() => setShowFormattingHelp(true)}>Formatting help</ActionBtn></span>
        </div>
      </> : props.currentDesc.length === 0 ?
        <div className={classes.NoDesc} onClick={() => setShowEdit(true)}>Add a description for this card</div>
        : <div className={classes.DescText}>{formattedDesc}</div>}
      {showFormattingHelp && <FormattingModal close={() => setShowFormattingHelp(false)} />}
    </div>
  );
};

CardDesc.propTypes = {
  currentDesc: PropTypes.string.isRequired,
  updateCardDesc: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  updateCardDesc: desc => dispatch(updateCardDesc(desc))
});

export default connect(null, mapDispatchToProps)(CardDesc);
