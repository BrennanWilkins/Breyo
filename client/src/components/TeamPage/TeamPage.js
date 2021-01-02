import React, { useState, useEffect } from 'react';
import classes from './TeamPage.module.css';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import TeamHeader from './TeamHeader/TeamHeader';
import { getActiveTeam } from '../../store/actions';

const TeamPage = props => {
  const [mode, setMode] = useState('boards');

  useEffect(() => {
    props.getActiveTeam(props.match.params.url, props.history.push);
  }, [props.match.params.url]);

  useEffect(() => {
    switch (props.location.search) {
      case '?view=members': return setMode('members');
      case '?view=settings': return setMode('settings');
      default: return setMode('boards');
    }
  }, [props.location.search]);

  return (
    <div className={classes.Container}>
      <TeamHeader />
      <div className={classes.Btns}>
        <Link to={`/team/${props.match.params.url}/?view=boards`} className={mode === 'boards' ? classes.Active : classes.Btn}>Boards</Link>
        <Link to={`/team/${props.match.params.url}/?view=members`} className={mode === 'members' ? classes.Active : classes.Btn}>Members</Link>
        <Link to={`/team/${props.match.params.url}/?view=settings`} className={mode === 'settings' ? classes.Active : classes.Btn}>Settings</Link>
      </div>
    </div>
  );
};

TeamPage.propTypes = {
  getActiveTeam: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  getActiveTeam: (url, push) => dispatch(getActiveTeam(url, push))
});

export default connect(null, mapDispatchToProps)(withRouter(TeamPage));
