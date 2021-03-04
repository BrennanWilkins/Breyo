import React, { useRef } from 'react';
import classes from './SelectModal.module.css';
import PropTypes from 'prop-types';
import { useModalToggle } from '../../../../utils/customHooks';
import { checkIcon } from '../../../UI/icons';

const SelectModal = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);

  return (
    <div ref={modalRef} className={classes.Container}>
      {props.options.map(option => (
        <div key={option} className={classes.Option} onClick={() => props.optionSelected(option)}>
          {option}{props.active === option && checkIcon}
        </div>
      ))}
    </div>
  );
};

SelectModal.propTypes = {
  close: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  optionSelected: PropTypes.func.isRequired,
  active: PropTypes.string.isRequired
};

export default SelectModal;
