// verify user is member of a team
const useIsTeamMember = (req, res, next) => {
  // teamID may be sent in body or in params
  const isTeamMember = req.userTeam[req.params.teamID] || req.userTeams[req.body.teamID];
  if (!isTeamMember) { res.status(401).json({ msg: 'MUST BE TEAM MEMBER' }); }
  else { next(); }
};

module.exports = useIsTeamMember;
