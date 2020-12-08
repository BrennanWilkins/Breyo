import React, { useState, useRef, useEffect } from 'react';
import classes from './Select.module.css';
import { useModalToggle } from '../../../utils/customHooks';
import PropTypes from 'prop-types';

const Select = props => {
  const selectRef = useRef();
  const [showSelectModal, setShowSelectModal] = useState(false);
  useModalToggle(showSelectModal, selectRef, () => setShowSelectModal(false));

  useEffect(() => setShowSelectModal(false), [props.currentValue]);

  return (
    <div className={props.classNames ? [classes.Select, ...props.classNames].join(' ') : classes.Select} onClick={() => setShowSelectModal(true)}>
      <div className={classes.SelectTitle}>{props.title}</div>
      <div className={classes.SelectVal}>{props.currentValue}</div>
      {showSelectModal && <div className={classes.SelectModal} ref={selectRef}>
        {props.children}
      </div>}
    </div>
  );
};

Select.propTypes = {
  title: PropTypes.string.isRequired,
  currentValue: PropTypes.string.isRequired,
  classNames: PropTypes.array
};

export default Select;
