// verify user is member of a team
const useIsTeamMember = (req, res, next) => {
  // teamID may be sent in body or in params
  const isTeamMember = req.userTeams[req.params.teamID] || req.userTeams[req.body.teamID];
  if (!isTeamMember) { return res.status(401).json({ msg: 'MUST BE TEAM MEMBER' }); }
  next();
};

module.exports = useIsTeamMember;
