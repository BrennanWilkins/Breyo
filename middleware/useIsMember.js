// verify that user is a member of the board
const useIsMember = (req, res, next) => {
  // if get/delete req then boardID sent in params, if put/post then is sent in body
  const isMember = (req.method === 'GET' || req.method === 'DELETE') ?
    req.userMembers[req.params.boardID] :
    req.userMembers[req.body.boardID];

  if (!isMember) { return res.status(401).json({ msg: 'MUST BE MEMBER' }); }
  next();
};

module.exports = useIsMember;
