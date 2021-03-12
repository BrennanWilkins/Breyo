import React, { useRef } from 'react';
import classes from './InfoModal.module.css';
import PropTypes from 'prop-types';
import { useModalToggle } from '../../../../utils/customHooks';

const InfoModal = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);

  return (
    <div ref={modalRef} className={classes.Container}>
      <p>All of your cards that have both a start and due date assigned to them will appear here.</p>
      <p>You can filter the cards by their list, by board member, or by custom label.</p>
      <p>You can click on any card to view the card's page, and change it's start or due date by grabbing the start of end of the card on the roadmap and resizing it.</p>
    </div>
  );
};

InfoModal.propTypes = {
  close: PropTypes.func.isRequired
};

export default InfoModal;
