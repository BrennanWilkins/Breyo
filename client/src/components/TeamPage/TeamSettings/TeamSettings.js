import React, { useState } from 'react';
import classes from './TeamSettings.module.css';
import DeleteTeamModal from './DeleteTeamModal/DeleteTeamModal';

const TeamSettings = props => {
  const [showDeleteTeam, setShowDeleteTeam] = useState(false);

  return (
    <div className={classes.Container}>
      <div className={classes.Option} onClick={() => setShowDeleteTeam(true)}>Delete this team</div>
      {showDeleteTeam && <DeleteTeamModal close={() => setShowDeleteTeam(false)} />}
    </div>
  );
};

export default TeamSettings;
