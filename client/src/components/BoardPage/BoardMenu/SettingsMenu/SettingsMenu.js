import React, { useState } from 'react';
import classes from './SettingsMenu.module.css';
import { ActionBtn } from '../../../UI/Buttons/Buttons';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DeleteModal from '../DeleteModal/DeleteModal';
import { withRouter } from 'react-router-dom';
import { updateRefreshEnabled, deleteBoard } from '../../../../store/actions';

const SettingsMenu = props => {
  const [showDeleteBoard, setShowDeleteBoard] = useState(false);

  const deleteBoardHandler = () => {
    props.deleteBoard();
    props.history.push('/');
  };

  return (
    <>
      <div className={classes.RefreshBtn}>
        <ActionBtn clicked={props.updateRefreshEnabled}>{props.refreshEnabled ? 'Disable' : 'Enable'} auto refresh</ActionBtn>
        <div>Disabling auto refresh will cause your board not to automatically update when other members create changes on the board.</div>
      </div>
      <div className={classes.DeleteBoard}>
        <ActionBtn clicked={() => setShowDeleteBoard(true)}>Delete Board</ActionBtn>
        {showDeleteBoard && <DeleteModal confirmText="DELETE THIS BOARD" close={() => setShowDeleteBoard(false)}
        delete={deleteBoardHandler} userIsAdmin={props.userIsAdmin} mode="board" />}
      </div>
    </>
  );
};

SettingsMenu.propTypes = {
  refreshEnabled: PropTypes.bool.isRequired,
  updateRefreshEnabled: PropTypes.func.isRequired,
  userIsAdmin: PropTypes.bool.isRequired,
  deleteBoard: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  userIsAdmin: state.board.userIsAdmin,
  refreshEnabled: state.board.refreshEnabled
});

const mapDispatchToProps = dispatch => ({
  updateRefreshEnabled: () => dispatch(updateRefreshEnabled()),
  deleteBoard: () => dispatch(deleteBoard())
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SettingsMenu));
