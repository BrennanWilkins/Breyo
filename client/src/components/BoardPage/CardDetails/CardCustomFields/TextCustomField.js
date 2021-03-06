import React, { useState } from 'react';
import classes from './CardCustomFields.module.css';
import PropTypes from 'prop-types';
import Input from 'react-input-autosize';
import { useDidUpdate } from '../../../../utils/customHooks';

const TextCustomField = props => {
  const [inputVal, setInputVal] = useState(props.value);

  useDidUpdate(() => {
    if (props.value !== inputVal) { setInputVal(props.value); }
  }, [props.value]);

  const blurHandler = () => {
    if (props.value === inputVal) { return; }
    if (!props.isNumber) {
      if (inputVal.length > 300) { return setInputVal(props.value); }
      props.updateValue(inputVal);
    } else {
      if (isNaN(inputVal) || inputVal > 1e20 || inputVal < -1e20) { return setInputVal(props.value); }
      const val = inputVal % 1 ? String(+parseFloat(inputVal).toFixed(12)) : inputVal;
      setInputVal(val);
      props.updateValue(val);
    }
  };

  return <Input className={classes.Input} value={inputVal} onBlur={blurHandler} onChange={e => setInputVal(e.target.value)} />;
};

TextCustomField.propTypes = {
  value: PropTypes.string,
  updateValue: PropTypes.func.isRequired,
  isNumber: PropTypes.bool
};

export default TextCustomField;
