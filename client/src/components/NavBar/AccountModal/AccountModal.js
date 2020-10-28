import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classes from './AccountModal.module.css';
import { connect } from 'react-redux';
import { logout } from '../../../store/actions';
import { useModalToggle } from '../../../utils/customHooks';
import { CloseBtn } from '../../UI/Buttons/Buttons';

const AccountModal = props => {
  const modalRef = useRef();
  useModalToggle(props.show, modalRef, props.close);

  return (
    <div ref={modalRef} className={props.show ? classes.ShowModal : classes.HideModal}>
      <div className={classes.Title}>
        Account
        <CloseBtn close={props.close} color="rgb(112, 112, 112)" />
      </div>
      <div className={classes.AccountInfo}>
        <div className={classes.NameIcon}>{props.fullName.slice(0, 1)}</div>
        <div>
          <div>{props.fullName}</div>
          <div className={classes.Email}>{props.email}</div>
        </div>
      </div>
      <div className={classes.Options}>
        <div>Help</div>
        <div onClick={props.logout}>Log Out</div>
      </div>
    </div>
  );
};

AccountModal.propTypes = {
  fullName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  logout: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  fullName: state.auth.fullName,
  email: state.auth.email
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountModal);
