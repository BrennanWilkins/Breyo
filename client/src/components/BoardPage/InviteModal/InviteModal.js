import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classes from './InviteModal.module.css';
import Button from '../../UI/Buttons/Buttons';
import { useModalToggle, useModalPos } from '../../../utils/customHooks';
import { connect } from 'react-redux';
import { sendInvite } from '../../../store/actions';
import ModalTitle from '../../UI/ModalTitle/ModalTitle';

const InviteModal = props => {
  const [email, setEmail] = useState('');
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);
  useModalPos(true, modalRef);

  return (
    <div className={classes.Container} ref={modalRef}>
      <ModalTitle close={props.close} title="Add a new member" light />
      <div className={classes.Input}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter user's email" />
        <Button disabled={email === '' || !props.isAdmin} clicked={() => { props.sendInvite(email, props.boardID); props.close(); }}>Send Invite</Button>
      </div>
      {!props.isAdmin && <div className={classes.ErrMsg}>You must be an admin of this board to invite other members.</div>}
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
