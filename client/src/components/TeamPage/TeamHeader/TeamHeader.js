import React, { useState } from 'react';
import classes from './TeamHeader.module.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ActionBtn } from '../../UI/Buttons/Buttons';
import { teamIcon, editIcon } from '../../UI/icons';
import EditTeam from '../EditTeam/EditTeam';
import EditLogo from '../EditLogo/EditLogo';

const TeamHeader = props => {
  const [showEditTeam, setShowEditTeam] = useState(false);
  const [showEditLogo, setShowEditLogo] = useState(false);

  return (
    <div className={classes.Header}>
      <div className={classes.HeaderContent}>
        <button className={classes.LogoBtn}>
          {props.logo ? <img src={props.logo} alt="" /> : teamIcon}
          <div className={classes.ChangeLogo} onClick={() => setShowEditLogo(true)}>Change</div>
        </button>
        {showEditLogo && <EditLogo teamID={props.teamID} logo={props.logo} close={() => setShowEditLogo(false)} />}
        {showEditTeam ? <EditTeam close={() => setShowEditTeam(false)} desc={props.desc}
        title={props.title} teamID={props.teamID} url={props.url} />
          : <>
          <div className={classes.TeamInfo}>
            <div className={classes.Title}>{props.title}</div>
            <div className={classes.Desc}>{props.desc}</div>
            <ActionBtn clicked={() => setShowEditTeam(true)}>{editIcon} Edit team details</ActionBtn>
          </div></>
        }
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
