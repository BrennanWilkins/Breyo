// verify user is member of a team
const useIsTeamMember = (req, res, next) => {
  // if get/delete req then teamID sent in params, if put/post then is sent in body
  const isTeamMember = (req.method === 'GET' || req.method === 'DELETE') ?
    req.userTeams[req.params.teamID] :
    req.userTeams[req.body.teamID];

  if (!isTeamMember) { return res.status(401).json({ msg: 'MUST BE TEAM MEMBER' }); }
  next();
};

module.exports = useIsTeamMember;
