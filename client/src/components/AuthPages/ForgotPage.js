import React, { useState } from 'react';
import classes from './AuthPages.module.css';
import { Link } from 'react-router-dom';
import AuthContainer from './AuthContainer';
import { instance as axios } from '../../axios';
import Spinner from '../UI/AuthSpinner/AuthSpinner';

const ForgotPage = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const submitHandler = async e => {
    e.preventDefault();
    if (!email) { return; }
    try {
      setLoading(true);
      await axios.get('/auth/forgotPassword/' + email);
      setMsg('Please check your email for a link to reset your password.');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      const errMsg = err?.response?.data?.msg || 'There was an error connecting to the server.';
      setMsg(errMsg);
    }
  };

  return (
    <AuthContainer>
      <div className={classes.LoginPanel} style={{ height: '350px'}}>
        <h3 className={classes.Title3}>Forgot your password?</h3>
        <p className={classes.SubTitle}>Please enter your email and check your inbox for a link to reset your password.</p>
        <form onSubmit={submitHandler} className={classes.Form}>
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <button type="submit" disabled={loading}>Reset my password</button>
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
