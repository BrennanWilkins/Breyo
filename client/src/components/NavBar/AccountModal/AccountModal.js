import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classes from './AccountModal.module.css';
import { connect } from 'react-redux';
import { logout } from '../../../store/actions';
import { useModalToggle } from '../../../utils/customHooks';
import { CloseBtn, BackBtn } from '../../UI/Buttons/Buttons';
import AccountInfo from '../../UI/AccountInfo/AccountInfo';
import Invites from './Invites/Invites';
import { Link } from 'react-router-dom';

const AccountModal = props => {
  const modalRef = useRef();

  const closeHandler = () => {
    props.close();
    setTimeout(() => setShowInvites(false), [250]);
  };

  useModalToggle(props.show, modalRef, closeHandler);
  const [showInvites, setShowInvites] = useState(false);

  return (
    <div ref={modalRef} className={props.show ? classes.ShowModal : classes.HideModal}>
      <div className={classes.Title}>
        <span className={showInvites ? classes.ShowBackBtn : classes.HideBackBtn}><BackBtn back={() => setShowInvites(false)} /></span>
        {showInvites ? 'Invites' : 'Account'}
        <CloseBtn close={props.close} color="rgb(112, 112, 112)" />
      </div>
      {showInvites ? <Invites close={closeHandler} email={props.email} fullName={props.fullName} /> :
      <><AccountInfo fullName={props.fullName} email={props.email} givePadding />
      <div className={classes.Options}>
        <div className={classes.Option} onClick={() => setShowInvites(true)}>Invites</div>
        <div className={classes.Link} onClick={props.close}><Link to="/my-account?view=activity">Activity</Link></div>
        <div className={classes.Link} onClick={props.close}><Link to="/my-account?view=settings">Settings</Link></div>
        <span className={classes.LineBreak}></span>
        <div className={classes.Link} onClick={props.close}><Link to="/help">Help</Link></div>
        <div className={classes.Option} onClick={props.logout}>Log Out</div>
      </div></>}
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
