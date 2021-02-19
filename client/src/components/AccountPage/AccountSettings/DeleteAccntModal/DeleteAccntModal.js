import React, { useState } from 'react';
import classes from './DeleteAccntModal.module.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteAccount } from '../../../../store/actions';
import { Input } from '../../../UI/Inputs/Inputs';
import ModalContainer from '../../../UI/ModalContainer/ModalContainer';
import { ActionBtn } from '../../../UI/Buttons/Buttons';

const DeleteAccntModal = props => {
  const [password, setPassword] = useState('');

  return (
    <ModalContainer className={classes.Container} close={props.close} title="Delete my account">
      <div className={classes.Info}>
        Deleting your account cannot be undone. Any boards in which you are the only member will be deleted, and any boards in which you are the only
        admin will result in all other members being promoted to admin.
      </div>
      <p>To confirm, please enter your password below.</p>
      <Input className={classes.Input} type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <ActionBtn className={classes.DeleteBtn} clicked={() => props.deleteAccount(password)} disabled={!password}>DELETE MY ACCOUNT</ActionBtn>
    </ModalContainer>
  );
};

DeleteAccntModal.propTypes = {
  close: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  deleteAccount: pass => dispatch(deleteAccount(pass))
});

export default connect(null, mapDispatchToProps)(DeleteAccntModal);
