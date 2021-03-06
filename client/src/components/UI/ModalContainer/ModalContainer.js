import React, { useRef } from 'react';
import classes from './ModalContainer.module.css';
import PropTypes from 'prop-types';
import ModalTitle from '../ModalTitle/ModalTitle';
import { useModalToggle } from '../../../utils/customHooks';

const ModalContainer = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);

  return (
    <div ref={modalRef} className={`${classes.Container} ${props.className} ${props.addMargin ? classes.ContainerAfter : ''}`}>
      <ModalTitle close={props.close} title={props.title} light={props.light} lighter={props.lighter} />
      {props.children}
    </div>
  );
};

ModalContainer.propTypes = {
  className: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  light: PropTypes.bool,
  lighter: PropTypes.bool,
  addMargin: PropTypes.bool
};

export default ModalContainer;
