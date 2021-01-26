// verify that user is a member of the board
const useIsMember = (req, res, next) => {
  // boardID may be sent in body or in params
  const isMember = req.userMembers[req.body.boardID] || req.userMembers[req.params.boardID];
  if (!isMember) { return res.status(401).json({ msg: 'MUST BE MEMBER' }); }
  next();
};

module.exports = useIsMember;
