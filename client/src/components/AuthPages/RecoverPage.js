import React, { useState } from 'react';
import classes from './AuthPages.module.css';
import { Link } from 'react-router-dom';
import AuthContainer from './AuthContainer';
import { instance as axios } from '../../axios';
import Spinner from '../UI/AuthSpinner/AuthSpinner';
import { useHistory } from 'react-router';

const ForgotPage = () => {
  let history = useHistory();
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const submitHandler = async e => {
    e.preventDefault();
    if (pass === '' || confirmPass === '') { return; }
    if (pass.length < 8) { return setMsg('Your password must be at least 8 characters.'); }
    if (pass !== confirmPass) { return setMsg('Your password must be equal to confirm password.'); }
    try {
      setLoading(true);
      const recoverPassID = history.location.pathname.slice(18);
      await axios.post('/auth/forgotPassword', { recoverPassID, newPassword: pass });
      setLoading(false);
      setMsg('Your password was successfully changed.');
      // redirect user back to login on success
      setTimeout(() => history.push('/login'), 400);
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data.msg) { setMsg(err.response.data.msg); }
      else { setMsg('There was an error while connecting to the server.'); }
    }
  };

  return (
    <AuthContainer>
      <div className={classes.LoginPanel} style={{ height: '350px'}}>
        <h3 className={classes.Title3}>Recover your account</h3>
        <p className={classes.SubTitle}>Please enter your new password.</p>
        <form onSubmit={submitHandler} className={classes.Form}>
          <input type="password" placeholder="Enter your new password" value={pass} onChange={e => setPass(e.target.value)} />
          <input type="password" placeholder="Confirm your password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />
          <button type="submit" disabled={loading}>Save</button>
        </form>
        {loading && <Spinner />}
        {!loading && msg !== '' && <div className={classes.ShowErr}>{msg}</div>}
        <div className={classes.Links}>
          <div className={classes.Link}><Link to="/login">Back to login</Link></div>
        </div>
      </div>
    </AuthContainer>
  );
};

export default ForgotPage;
