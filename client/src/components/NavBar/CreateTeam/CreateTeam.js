import React, { useState, useRef } from 'react';
import classes from './CreateTeam.module.css';
import { useModalToggle, useDidUpdate } from '../../../utils/customHooks';
import PropTypes from 'prop-types';
import { CloseBtnCircle } from '../../UI/Buttons/Buttons';
import { instance as axios } from '../../../axios';
import { connect } from 'react-redux';
import { createTeam } from '../../../store/actions';
import { useHistory } from 'react-router';
import { scrumBoard } from '../../UI/illustrations';
import { checkURL } from '../../../utils/teamValidation';

const CreateTeam = props => {
  const history = useHistory();
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [desc, setDesc] = useState('');
  const [members, setMembers] = useState('');
  const [urlErrMsg, setUrlErrMsg] = useState('');
  const timer = useRef();
  const [errMsg, setErrMsg] = useState('');
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);

  useDidUpdate(() => {
    setUrlErrMsg('');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (url === '') { return; }
      const urlIsValid = checkURL(url);
      if (urlIsValid !== '') { return setUrlErrMsg(urlIsValid); }
      axios.get('/team/checkURL/' + url).then(res => {
        if (res.data.isTaken) { setUrlErrMsg('That URL is already taken.'); }
      });
    }, 1000);
  }, [url]);

  const submitHandler = () => {
    const urlIsValid = checkURL(url);
    if (urlIsValid !== '') { return setUrlErrMsg(urlIsValid); }
    if (title.length > 100) { return setErrMsg('Your team name cannot be over 100 characters.'); }
    if (desc.length > 400) { return setErrMsg('Your team description cannot be over 400 characters.'); }
    setLoading(true);
    axios.post('/team', { title, url, desc, members }).then(res => {
      setLoading(false);
      const team = { teamID: res.data.teamID, title, url };
      props.createTeam(team, history.push);
    }).catch(err => {
      setLoading(false);
      setErr(true);
      if (err.response && err.response.data) { setErrMsg(err.response.data.msg); }
      else { setErrMsg('There was an error connecting to the server.'); }
    });
  };

  return (
    <div ref={modalRef} className={classes.Container}>
      <h2 className={classes.Title}>Create a team<CloseBtnCircle close={props.close} /></h2>
      <div className={classes.Section}>
        <label>
          <div>Team name</div>
          <input value={title} onChange={e => setTitle(e.target.value)} />
        </label>
      </div>
      <div className={classes.Section}>
        <label>
          <div>Team URL<span>Optional</span></div>
          <input value={url} onChange={e => setUrl(e.target.value)} />
        </label>
        {urlErrMsg !== '' && <div className={classes.UrlTakenMsg}>{urlErrMsg}</div>}
        <div>Your team's URL can be used to customize the link to the team page</div>
      </div>
      <div className={classes.Section}>
        <label>
          <div>Team Description<span>Optional</span></div>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows="4" />
        </label>
      </div>
      <div className={classes.Section}>
        <label>
          <div>Invite users by email to join this team</div>
          <input value={members} onChange={e => setMembers(e.target.value)} />
        </label>
        <div>To invite multiple users, separate each email by a single space</div>
      </div>
      <button className={classes.CreateBtn} disabled={title === '' || loading || urlErrMsg !== ''} onClick={submitHandler}>Create Team</button>
      <div className={(err && !loading) ? classes.ErrMsg : classes.HideErrMsg}>{errMsg}</div>
      <div className={classes.Illustration}>{scrumBoard}</div>
    </div>
  );
};

CreateTeam.propTypes = {
  close: PropTypes.func.isRequired,
  createTeam: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  createTeam: (team, push) => dispatch(createTeam(team, push))
});

export default connect(null, mapDispatchToProps)(CreateTeam);
