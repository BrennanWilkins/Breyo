import React, { useState, useRef } from 'react';
import classes from './EditTeam.module.css';
import PropTypes from 'prop-types';
import SubmitBtns from '../../UI/SubmitBtns/SubmitBtns';
import { useDidUpdate } from '../../../utils/customHooks';
import { checkURL } from '../../../utils/teamValidation';
import { instance as axios } from '../../../axios';

const EditTeam = props => {
  const [title, setTitle] = useState(props.title);
  const [desc, setDesc] = useState(props.desc);
  const [url, setUrl] = useState(props.url);
  const [urlErrMsg, setUrlErrMsg] = useState(false);
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

  const submitHandler = e => {
    e.preventDefault();

  };

  return (
    <form className={classes.EditForm} onSubmit={submitHandler}>
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
      </div>
      <div className={classes.Section}>
        <label>
          <div>Team Description<span>Optional</span></div>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows="4" />
        </label>
      </div>
      <SubmitBtns close={props.close} text="Save" disabled={title === ''} />
    </form>
  );
};

EditTeam.propTypes = {
  close: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  teamID: PropTypes.string.isRequired
};

export default EditTeam;