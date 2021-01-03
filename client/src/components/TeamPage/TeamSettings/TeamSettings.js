import React, { useState } from 'react';
import classes from './TeamSettings.module.css';
import DeleteTeamModal from './DeleteTeamModal/DeleteTeamModal';
import LeaveTeamModal from './LeaveTeamModal/LeaveTeamModal';

const TeamSettings = props => {
  const [showDeleteTeam, setShowDeleteTeam] = useState(false);
  const [showLeaveTeam, setShowLeaveTeam] = useState(false);

  return (
    <div className={classes.Container}>
      <div className={classes.Option} onClick={() => setShowLeaveTeam(true)}>Leave this team</div>
      <div className={classes.Option} onClick={() => setShowDeleteTeam(true)}>Delete this team</div>
      {showDeleteTeam && <DeleteTeamModal close={() => setShowDeleteTeam(false)} />}
      {showLeaveTeam && <LeaveTeamModal close={() => setShowLeaveTeam(false)} />}
    </div>
  );
};

export default TeamSettings;
