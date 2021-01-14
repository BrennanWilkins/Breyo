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
      <CloseBtn className={classes.CloseBtn} close={props.close} />
      <AccountInfo fullName={props.fullName} email={props.email} noBorder avatar={props.avatars[props.email]} />
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
  left: PropTypes.number,
  removeCardMember: PropTypes.func.isRequired,
  removeCardMemberCurrentCard: PropTypes.func.isRequired,
  avatars: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  avatars: state.board.avatars
});

const mapDispatchToProps = dispatch => ({
  removeCardMember: (email, cardID, listID) => dispatch(removeCardMember(email, cardID, listID)),
  removeCardMemberCurrentCard: email => dispatch(removeCardMemberCurrentCard(email))
});

export default connect(mapStateToProps, mapDispatchToProps)(CardMemberModal);
