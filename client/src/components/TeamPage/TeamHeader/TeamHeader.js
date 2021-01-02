import React, { useState } from 'react';
import classes from './TeamHeader.module.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ActionBtn } from '../../UI/Buttons/Buttons';
import { teamIcon, editIcon } from '../../UI/icons';

const TeamHeader = props => {
  const [showEditTeam, setShowEditTeam] = useState(false);

  return (
    <div className={classes.Header}>
      <div className={classes.HeaderContent}>
        <button className={classes.LogoBtn}>
        {teamIcon}
        <div className={classes.ChangeLogo}>Change</div>
        </button>
        <div className={classes.TeamInfo}>
          <div className={classes.Title}>{props.title}</div>
          <div className={classes.Desc}>{props.desc}</div>
          <ActionBtn clicked={() => setShowEditTeam(true)}>{editIcon} Edit team details</ActionBtn>
        </div>
      </div>
    </div>
  );
};

TeamHeader.propTypes = {
  desc: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  logo: PropTypes.string,
  teamID: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  desc: state.team.desc,
  title: state.team.title,
  logo: state.team.logo,
  teamID: state.team.teamID,
  url: state.team.url
});

export default connect(mapStateToProps)(TeamHeader);
