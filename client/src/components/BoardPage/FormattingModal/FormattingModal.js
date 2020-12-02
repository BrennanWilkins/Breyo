import React, { useRef } from 'react';
import classes from './FormattingModal.module.css';
import { useModalToggle } from '../../../utils/customHooks';
import { CloseBtn } from '../../UI/Buttons/Buttons';
import { arrowIcon } from '../../UI/icons';
import PropTypes from 'prop-types';

const FormattingModal = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);

  return (
    <div ref={modalRef} className={classes.Container}>
      <div className={classes.Title}>
        Formatting Help
        <span className={classes.CloseBtn}><CloseBtn close={props.close} /></span>
      </div>
      <div className={classes.Option}>
        <div>Bold</div>
        <span>*This text will be bold*{arrowIcon}</span>
        <span><b>This text will be bold</b></span>
      </div>
      <div className={classes.Option}>
        <div>Italics</div>
        <span>The word ~Hello~ will be in italics{arrowIcon}</span>
        <span>The word <i>Hello</i> will be in italics</span>
      </div>
      <div className={classes.Option}>
        <div>Links</div>
        <span>To visit this link, _click here_[example.com]{arrowIcon}</span>
        <span>To visit this link, <a href="http://www.example.com" target="_blank" rel="noopener noreferrer">click here</a></span>
      </div>
      <div className={classes.Option}>
        <div>Code</div>
        <span>The following will be formatted as code `console.log('Hello World');`{arrowIcon}</span>
        <span>The following will be formatted as code <code>console.log('Hello World');</code></span>
      </div>
    </div>
  );
};

FormattingModal.propTypes = {
  close: PropTypes.func.isRequired
};

export default FormattingModal;
