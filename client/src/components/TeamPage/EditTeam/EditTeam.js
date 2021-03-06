import React, { useState, useEffect } from 'react';
import classes from './EditTeam.module.css';
import PropTypes from 'prop-types';
import SubmitBtns from '../../UI/SubmitBtns/SubmitBtns';
import { checkURL } from '../../../utils/teamValidation';
import { instance as axios } from '../../../axios';
import { connect } from 'react-redux';
import { editTeam } from '../../../store/actions';
import { useHistory } from 'react-router';
import { useDidUpdate } from '../../../utils/customHooks';

const EditTeam = props => {
  const history = useHistory();
  const [title, setTitle] = useState(props.title);
  const [desc, setDesc] = useState(props.desc);
  const [url, setUrl] = useState(props.url);
  const [urlErrMsg, setUrlErrMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUrlErrMsg('');
    const timer = setTimeout(() => {
      if (!url || url === props.url) { return; }
      const urlIsInvalid = checkURL(url);
      if (urlIsInvalid) { return setUrlErrMsg(urlIsInvalid); }
      axios.get('/team/checkURL/' + url).then(res => {
        if (res.data.isTaken) { setUrlErrMsg('That URL is already taken.'); }
      }).catch(err => setUrlErrMsg('There was an error while checking if that URL is taken.'));
    }, 1000);

    return () => clearTimeout(timer);
  }, [url]);

  useEffect(() => setErrMsg(''), [url, desc, title]);

  useDidUpdate(() => {
    // update state if socket sent to update info
    if (desc !== props.desc) { setDesc(props.desc); }
    if (title !== props.title) { setTitle(props.title); }
  }, [props.desc, props.title]);

  const submitHandler = async e => {
    e.preventDefault();
    const urlIsInvalid = checkURL(url);
    if (urlIsInvalid) { return setUrlErrMsg(urlIsInvalid); }
    if (title.length > 100) { return setErrMsg('Your team name cannot be over 100 characters.'); }
    if (desc.length > 400) { return setErrMsg('Your team description cannot be over 400 characters.'); }
    setLoading(true);
    try {
      await axios.put(`/team/info/${props.teamID}`, { title, desc, url });
      const payload = { title, desc, url, teamID: props.teamID };
      props.editTeam(payload);
      // if url changed then reload team page w new url
      if (url !== props.url) { history.replace(`/team/${url}${history.location.search}`); }
      props.close();
    } catch (err) {
      setLoading(false);
      setErrMsg(err?.response?.status === 403 ? 'You must be an admin to edit the team details.' :
      (err?.response?.data?.msg || 'There was an error while updating the team details.'));
    }
  };

  return (
    <>
    <form className={classes.EditForm} onSubmit={submitHandler}>
      <div className={classes.Section}>
        <label>
          <div>Team name</div>
          <input value={title} onChange={e => setTitle(e.target.value)} disabled={loading || !props.userIsAdmin} />
        </label>
      </div>
      <div className={classes.Section}>
        <label>
          <div>Team URL<span>Optional</span></div>
          <input value={url} onChange={e => setUrl(e.target.value)} disabled={loading || !props.userIsAdmin} />
        </label>
        {urlErrMsg !== '' && <div className={classes.UrlTakenMsg}>{urlErrMsg}</div>}
      </div>
      <div className={classes.Section}>
        <label>
          <div>Team Description<span>Optional</span></div>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows="4" disabled={loading || !props.userIsAdmin} />
        </label>
      </div>
      <SubmitBtns close={props.close} text="Save" disabled={!title || !!urlErrMsg || loading || !props.userIsAdmin} />
      <div className={errMsg ? classes.ErrMsg : classes.HideErrMsg}>{errMsg}</div>
      {!props.userIsAdmin && <div className={classes.NotAdmin}>You must be an admin of this team to edit the team's details.</div>}
    </form>
    </>
  );
};

EditTeam.propTypes = {
  close: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  teamID: PropTypes.string.isRequired,
  editTeam: PropTypes.func.isRequired,
  userIsAdmin: PropTypes.bool.isRequired
};

const mapDispatchToProps = dispatch => ({
  editTeam: payload => dispatch(editTeam(payload))
});

export default connect(null, mapDispatchToProps)(EditTeam);
