// verify user is admin of a team
const useIsTeamAdmin = (req, res, next) => {
  // teamID may be sent in body or in params
  const isTeamAdmin = req.userAdminTeams[req.params.teamID] || req.userAdminTeams[req.body.teamID];
  if (!isTeamAdmin) { return res.status(401).json({ msg: 'MUST BE TEAM ADMIN' }); }
  next();
};

module.exports = useIsTeamAdmin;
