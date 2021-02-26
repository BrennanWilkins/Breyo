import React, { useRef } from 'react';
import classes from './FixedModalContainer.module.css';
import PropTypes from 'prop-types';
import { useModalToggle } from '../../../utils/customHooks';
import { CloseBtnCircle } from '../Buttons/Buttons';

const FixedModalContainer = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);

  return (
    <div className={classes.Container}>
      <div className={`${classes.Modal} ${props.className || ''}`} style={props.style || null} ref={modalRef}>
        <CloseBtnCircle close={props.close} />
        {props.children}
      </div>
    </div>
  );
};

FixedModalContainer.propTypes = {
  close: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object
};

export default FixedModalContainer;
