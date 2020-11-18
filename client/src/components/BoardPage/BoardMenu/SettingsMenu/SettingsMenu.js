import React, { useState, useEffect } from 'react';
import classes from './SettingsMenu.module.css';
import { ActionBtn } from '../../../UI/Buttons/Buttons';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DeleteModal from '../DeleteModal/DeleteModal';
import { withRouter } from 'react-router-dom';
import { deleteBoard, deleteBoardActivity, leaveBoard } from '../../../../store/actions';

const SettingsMenu = props => {
  const [showDeleteBoard, setShowDeleteBoard] = useState(false);
  const [showDeleteActivity, setShowDeleteActivity] = useState(false);
  const [showLeaveBoard, setShowLeaveBoard] = useState(false);
  const [adminCount, setAdminCount] = useState(props.members.filter(member => member.isAdmin).length);

  useEffect(() => setAdminCount(props.members.filter(member => member.isAdmin).length), [props.members]);

  const deleteBoardHandler = () => {
    props.deleteBoard();
    props.history.push('/');
  };

  const deleteActivityHandler = () => {
    setShowDeleteActivity(false);
    props.deleteBoardActivity();
  };

  const leaveBoardHandler = () => {
    setShowLeaveBoard(false);
    props.leaveBoard();
    props.history.push('/');
  };

  return (
    <>
      <div className={classes.ModalContainer}>
        <ActionBtn clicked={() => setShowLeaveBoard(true)}>Leave this board</ActionBtn>
        {showLeaveBoard && <DeleteModal confirmText="LEAVE BOARD" close={() => setShowLeaveBoard(false)}
        delete={leaveBoardHandler} userIsAdmin={props.userIsAdmin} adminCount={adminCount} mode="leave" />}
      </div>
      <div className={classes.ModalContainer}>
        <ActionBtn clicked={() => setShowDeleteActivity(true)}>Delete all board activity</ActionBtn>
        {showDeleteActivity && <DeleteModal confirmText="DELETE ACTIVITY" close={() => setShowDeleteActivity(false)}
        delete={deleteActivityHandler} userIsAdmin={props.userIsAdmin} mode="activity" />}
      </div>
      <div className={classes.ModalContainer}>
        <ActionBtn clicked={() => setShowDeleteBoard(true)}>Delete board</ActionBtn>
        {showDeleteBoard && <DeleteModal confirmText="DELETE THIS BOARD" close={() => setShowDeleteBoard(false)}
        delete={deleteBoardHandler} userIsAdmin={props.userIsAdmin} mode="board" />}
      </div>
    </>
  );
};

SettingsMenu.propTypes = {
  userIsAdmin: PropTypes.bool.isRequired,
  deleteBoard: PropTypes.func.isRequired,
  deleteBoardActivity: PropTypes.func.isRequired,
  members: PropTypes.array.isRequired,
  leaveBoard: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  userIsAdmin: state.board.userIsAdmin,
  members: state.board.members
});

const mapDispatchToProps = dispatch => ({
  deleteBoard: () => dispatch(deleteBoard()),
  deleteBoardActivity: () => dispatch(deleteBoardActivity()),
  leaveBoard: () => dispatch(leaveBoard())
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SettingsMenu));
