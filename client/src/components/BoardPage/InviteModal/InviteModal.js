import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classes from './InviteModal.module.css';
import Button from '../../UI/Buttons/Buttons';
import { useModalToggle, useModalPos } from '../../../utils/customHooks';
import { connect } from 'react-redux';
import { sendInvite } from '../../../store/actions';
import ModalTitle from '../../UI/ModalTitle/ModalTitle';
import { Input } from '../../UI/Inputs/Inputs';
import { isEmail } from '../../../utils/authValidation';

const InviteModal = props => {
  const [email, setEmail] = useState('');
  const modalRef = useRef();
  const [emailInvalid, setEmailInvalid] = useState(false);
  useModalToggle(true, modalRef, props.close);
  useModalPos(true, modalRef);

  const inviteHandler = () => {
    if (!isEmail(email)) { return setEmailInvalid(true); }
    props.sendInvite(email, props.boardID);
    props.close();
  };

  const emailHandler = e => {
    setEmail(e.target.value);
    setEmailInvalid(false);
  };

  return (
    <div className={classes.Container} ref={modalRef}>
      <ModalTitle close={props.close} title="Invite to board" light />
      <div className={classes.Input}>
        <Input value={email} onChange={emailHandler} placeholder="Enter user's email" />
        <Button disabled={!email || !props.isAdmin} clicked={inviteHandler}>Send Invite</Button>
      </div>
      {!props.isAdmin && <div className={classes.ErrMsg}>You must be an admin of this board to invite other members.</div>}
      {emailInvalid && <div className={classes.ErrMsg}>Please enter a valid email address.</div>}
    </div>
  );
};

InviteModal.propTypes = {
  close: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  sendInvite: PropTypes.func.isRequired,
  boardID: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  isAdmin: state.board.userIsAdmin
});

const mapDispatchToProps = dispatch => ({
  sendInvite: (email, boardID) => dispatch(sendInvite(email, boardID))
});

export default connect(mapStateToProps, mapDispatchToProps)(InviteModal);
