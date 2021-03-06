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
  useModalToggle(true, modalRef, props.close);
  const [showInvites, setShowInvites] = useState(false);

  const totInvites = props.invites.length + props.teamInvites.length;

  return (
    <div ref={modalRef} className={`StyledScrollbar ${classes.Modal}`}>
      <div className={classes.Title}>
        <span className={showInvites ? classes.ShowBackBtn : classes.HideBackBtn}><BackBtn back={() => setShowInvites(false)} /></span>
        {showInvites ? 'Invites' : 'Account'}
        <CloseBtn close={props.close} color="rgb(112, 112, 112)" />
      </div>
      {showInvites ? <Invites close={props.close} invites={props.invites} teamInvites={props.teamInvites} /> :
      <><AccountInfo fullName={props.fullName} email={props.email} givePadding avatar={props.avatar} />
      <div className={classes.Options}>
        <div className={classes.Option} onClick={() => setShowInvites(true)}>Invites
          {totInvites > 0 && <span className={classes.InviteNotifIcon}>{totInvites}</span>}
        </div>
        <div className={classes.Link} onClick={props.close}><Link to="/my-account?view=activity">Activity</Link></div>
        <div className={classes.Link} onClick={props.close}><Link to="/my-account?view=settings">Settings</Link></div>
        <span className={classes.LineBreak} />
        <div className={classes.Link} onClick={props.close}><Link to="/help">Help</Link></div>
        <div className={classes.Option} onClick={props.logout}>Log Out</div>
        <span className={classes.LineBreak} />
        <div className={classes.Option} onClick={props.showFeedback}>Send feedback</div>
      </div></>}
    </div>
  );
};

AccountModal.propTypes = {
  fullName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  logout: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  invites: PropTypes.array.isRequired,
  teamInvites: PropTypes.array.isRequired,
  avatar: PropTypes.string,
  showFeedback: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  fullName: state.user.fullName,
  email: state.user.email,
  invites: state.user.invites,
  teamInvites: state.user.teamInvites,
  avatar: state.user.avatar
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountModal);
