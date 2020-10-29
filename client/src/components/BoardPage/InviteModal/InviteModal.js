import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classes from './InviteModal.module.css';
import Button, { CloseBtn } from '../../UI/Buttons/Buttons';
import { useModalToggle } from '../../../utils/customHooks';
import { connect } from 'react-redux';
import { sendInvite } from '../../../store/actions';

const InviteModal = props => {
  const [email, setEmail] = useState('');
  const modalRef = useRef();

  useModalToggle(true, modalRef, props.close);

  return (
    <div className={classes.Container} ref={modalRef}>
      <div className={classes.Title}>
        Add a new member
        <CloseBtn close={props.close} />
      </div>
      <div className={classes.Input}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter user's email" />
        <Button disabled={email === '' || !props.isAdmin} clicked={() => props.sendInvite(email, props.boardID)}>Send Invite</Button>
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
  isAdmin: state.auth.boards.find(board => board.boardID === state.board.boardID).isAdmin
});

const mapDispatchToProps = dispatch => ({
  sendInvite: (email, boardID) => dispatch(sendInvite(email, boardID))
});

export default connect(mapStateToProps, mapDispatchToProps)(InviteModal);
