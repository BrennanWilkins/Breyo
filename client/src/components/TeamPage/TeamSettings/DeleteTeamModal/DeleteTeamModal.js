import React, { useState } from 'react';
import classes from './DeleteTeamModal.module.css';
import PropTypes from 'prop-types';
import { deleteTeam } from '../../../../store/actions';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import { Input } from '../../../UI/Inputs/Inputs';
import ModalContainer from '../../../UI/ModalContainer/ModalContainer';
import { ActionBtn } from '../../../UI/Buttons/Buttons';

const DeleteTeamModal = props => {
  const history = useHistory();
  const [inputVal, setInputVal] = useState('');

  return (
    <ModalContainer className={classes.Modal} title="Delete this team?" close={props.close} addMargin>
      {props.userIsAdmin ?
      <>
        <p>Deleting a team will not delete the team's boards. To confirm, please type 'DELETE THIS TEAM' below.</p>
        <Input className={classes.Input} value={inputVal} onChange={e => setInputVal(e.target.value)} />
        <ActionBtn className={classes.DeleteBtn} disabled={inputVal !== 'DELETE THIS TEAM'} clicked={() => props.deleteTeam(history.push)}>DELETE TEAM</ActionBtn>
      </>
      : <p>You must be an admin to delete this team.</p>}
    </ModalContainer>
  );
};

DeleteTeamModal.propTypes = {
  close: PropTypes.func.isRequired,
  deleteTeam: PropTypes.func.isRequired,
  userIsAdmin: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  userIsAdmin: state.team.userIsAdmin
});

const mapDispatchToProps = dispatch => ({
  deleteTeam: push => dispatch(deleteTeam(push))
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteTeamModal);
