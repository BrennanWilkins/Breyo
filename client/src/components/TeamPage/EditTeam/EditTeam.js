import React, { useState, useRef, useEffect } from 'react';
import classes from './EditTeam.module.css';
import PropTypes from 'prop-types';
import SubmitBtns from '../../UI/SubmitBtns/SubmitBtns';
import { useDidUpdate } from '../../../utils/customHooks';
import { checkURL } from '../../../utils/teamValidation';
import { instance as axios } from '../../../axios';
import { connect } from 'react-redux';
import { editTeam } from '../../../store/actions';

const EditTeam = props => {
  const [title, setTitle] = useState(props.title);
  const [desc, setDesc] = useState(props.desc);
  const [url, setUrl] = useState(props.url);
  const [urlErrMsg, setUrlErrMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const timer = useRef();

  useDidUpdate(() => {
    setUrlErrMsg('');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (url === '' || url === props.url) { return; }
      const urlIsValid = checkURL(url);
      if (urlIsValid !== '') { return setUrlErrMsg(urlIsValid); }
      axios.get('/team/checkURL/' + url).then(res => {
        if (res.data.isTaken) { setUrlErrMsg('That URL is already taken.'); }
      });
    }, 1000);
  }, [url]);

  useEffect(() => setErrMsg(''), [url, desc, title]);

  const submitHandler = async e => {
    e.preventDefault();
    const urlIsValid = checkURL(url);
    if (urlIsValid !== '') { return setUrlErrMsg(urlIsValid); }
    if (title.length > 100) { return setErrMsg('Your team name cannot be over 100 characters.'); }
    if (desc.length > 400) { return setErrMsg('Your team description cannot be over 400 characters.'); }
    setLoading(true);
    try {
      await axios.put('/team', { title, desc, url, teamID: props.teamID });
      const payload = { title, desc, url, teamID: props.teamID };
      props.editTeam(payload);
      props.close();
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data && err.response.data.msg) { setErrMsg(err.response.data.msg); }
      else { setErrMsg('There was an error while connecting to the server.'); }
    }
  };

  return (
    <form className={classes.EditForm} onSubmit={submitHandler}>
      <div className={classes.Section}>
        <label>
          <div>Team name</div>
          <input value={title} onChange={e => setTitle(e.target.value)} disabled={loading} />
        </label>
      </div>
      <div className={classes.Section}>
        <label>
          <div>Team URL<span>Optional</span></div>
          <input value={url} onChange={e => setUrl(e.target.value)} disabled={loading} />
        </label>
        {urlErrMsg !== '' && <div className={classes.UrlTakenMsg}>{urlErrMsg}</div>}
      </div>
      <div className={classes.Section}>
        <label>
          <div>Team Description<span>Optional</span></div>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows="4" disabled={loading} />
        </label>
      </div>
      <SubmitBtns close={props.close} text="Save" disabled={title === '' || urlErrMsg || loading} />
      <div className={errMsg !== '' ? classes.ErrMsg : classes.HideErrMsg}>{errMsg}</div>
    </form>
  );
};

EditTeam.propTypes = {
  close: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  teamID: PropTypes.string.isRequired,
  editTeam: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  editTeam: payload => dispatch(editTeam(payload))
});

export default connect(null, mapDispatchToProps)(EditTeam);
