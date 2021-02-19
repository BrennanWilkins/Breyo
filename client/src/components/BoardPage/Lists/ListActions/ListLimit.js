import React, { useState } from 'react';
import classes from './ListActions.module.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setListLimit, removeListLimit } from '../../../../store/actions';
import { Input } from '../../../UI/Inputs/Inputs';
import { ActionBtn } from '../../../UI/Buttons/Buttons';

const ListLimit = props => {
  const [limitVal, setLimitVal] = useState(String(props.limit) || '');
  const [errMsg, setErrMsg] = useState('');

  const changeHandler = e => {
    if (errMsg) { setErrMsg(''); }
    setLimitVal(e.target.value);
  };

  const saveHandler = () => {
    if (!limitVal) { return; }
    if (limitVal < 0) { return setErrMsg('Please enter a positive value for the limit.'); }
    if (limitVal % 1) { return setErrMsg('Please enter a whole number as the limit.'); }
    if (limitVal > 200) { return setErrMsg('You cannot have more than 200 cards in a list.'); }
    props.setLimit(props.listID, +limitVal);
    props.close();
  };

  const removeHandler = () => {
    if (!props.limit) { return; }
    props.removeLimit(props.listID);
    props.close();
  };

  return (
    <div className={classes.ViewContainer}>
      <Input className={classes.LimitInput} type="number" value={limitVal} onChange={changeHandler} placeholder="No limit set" />
      <p className={classes.LimitInfo}>This list will be highlighted if the number of cards goes over the limit.</p>
      <div className={classes.LimitBtns}>
        <ActionBtn className={classes.SaveLimitBtn} clicked={saveHandler}>Save</ActionBtn>
        <ActionBtn className={classes.RemoveLimitBtn} clicked={removeHandler}>Remove</ActionBtn>
      </div>
      {errMsg && <div className={classes.LimitErrMsg}>{errMsg}</div>}
    </div>
  );
};

ListLimit.propTypes = {
  limit: PropTypes.number,
  listID: PropTypes.string.isRequired,
  setLimit: PropTypes.func.isRequired,
  removeLimit: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  setLimit: (listID, limit) => dispatch(setListLimit(listID, limit)),
  removeLimit: listID => dispatch(removeListLimit(listID))
});

export default connect(null, mapDispatchToProps)(ListLimit);
