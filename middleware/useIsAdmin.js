// verify that the user is an admin of the board
const useIsAdmin = (req, res, next) => {
  // boardID may be sent in body or in params
  const isAdmin = req.userAdmins[req.body.boardID] || req.userAdmins[req.params.boardID];
  if (!isAdmin) { res.status(401).json({ msg: 'MUST BE ADMIN' }); }
  else { next(); }
};

module.exports = useIsAdmin;
