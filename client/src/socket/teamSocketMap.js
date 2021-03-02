import * as actionTypes from '../store/actions/actionTypes';

// map of socket type to respective actionType for team socket
const socketMap = {
  'put/team/logo': actionTypes.CHANGE_TEAM_LOGO,
  'delete/team/logo': actionTypes.REMOVE_TEAM_LOGO,
  'delete/team': actionTypes.DELETE_TEAM
};

export default socketMap;
