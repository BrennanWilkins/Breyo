import React, { useRef } from 'react';
import classes from './CardMemberModal.module.css';
import PropTypes from 'prop-types';
import { useModalToggle } from '../../../utils/customHooks';
import { CloseBtn } from '../Buttons/Buttons';
import AccountInfo from '../AccountInfo/AccountInfo';
import { connect } from 'react-redux';
import { removeCardMember, removeCardMemberCurrentCard } from '../../../store/actions';

const CardMemberModal = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);

  const removeHandler = () => {
    if (props.inCard) { props.removeCardMember(props.email, props.cardID, props.listID); }
    else { props.removeCardMemberCurrentCard(props.email); }
    props.close();
  };

  return (
    <div ref={modalRef} style={props.inCard ? {top: props.top + 'px', left: props.left + 'px'} : null}
    className={props.inCard ? classes.FixedContainer : classes.Container}>
      <div className={classes.CloseBtn}><CloseBtn close={props.close} /></div>
      <AccountInfo fullName={props.fullName} email={props.email} noBorder />
      <div className={classes.RemoveBtn} onClick={removeHandler}>Remove from card</div>
    </div>
  );
};

CardMemberModal.propTypes = {
  close: PropTypes.func.isRequired,
  fullName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  cardID: PropTypes.string,
  listID: PropTypes.string,
  inCard: PropTypes.bool,
  top: PropTypes.number,
  left: PropTypes.number
};

const mapDispatchToProps = dispatch => ({
  removeCardMember: (email, cardID, listID) => dispatch(removeCardMember(email, cardID, listID)),
  removeCardMemberCurrentCard: email => dispatch(removeCardMemberCurrentCard(email))
});

export default connect(null, mapDispatchToProps)(CardMemberModal);
