// verify user is admin of a team
const useIsTeamAdmin = (req, res, next) => {
  const isTeamAdmin = req.userAdminTeams[req.params.teamID];
  if (!isTeamAdmin) { return res.status(403); }
  next();
};

module.exports = useIsTeamAdmin;
