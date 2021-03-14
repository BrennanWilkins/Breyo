import React, { useState, useMemo } from 'react';
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

  const formattedDesc = useMemo(() => parseToJSX(props.currentDesc), [props.currentDesc]);

  const saveDescHandler = () => {
    if (descInput.length > 600) { setShowEdit(false); return setDescInput(props.currentDesc); }
    props.updateCardDesc(descInput);
    setShowEdit(false);
  };

  const inputChangeHandler = e => {
    if (e.target.value.length > 600) { return; }
    setDescInput(e.target.value);
  };

  return (
    <div>
      <div className={classes.Title}>
        {descIcon}Description
        {!showEdit && props.currentDesc.length > 0 && <ActionBtn className={classes.EditBtn} clicked={() => setShowEdit(true)}>Edit</ActionBtn>}
      </div>
      {
        showEdit ?
          <>
            <TextArea className={classes.Input} minRows="2" value={descInput} onChange={inputChangeHandler}
            placeholder="Add a description for this card" autoFocus />
            <div className={classes.Btns}>
              <div className={classes.LeftBtns}>
                <Button className={classes.SaveBtn} clicked={saveDescHandler} disabled={descInput === props.currentDesc}>Save</Button>
                <CloseBtn className={classes.CloseBtn} close={() => { setShowEdit(false); setDescInput(props.currentDesc); }} />
              </div>
              <ActionBtn clicked={() => setShowFormattingHelp(true)}>Formatting help</ActionBtn>
            </div>
          </>
        : props.currentDesc.length === 0 ?
          <div className={classes.NoDesc} onClick={() => setShowEdit(true)}>Add a description for this card</div>
        :
          <div className={classes.DescText}>{formattedDesc}</div>
      }
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
