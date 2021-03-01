// verify that the user is an admin of the board
const useIsAdmin = (req, res, next) => {
  // if get/delete req then boardID sent in params, if put/post then is sent in body
  const isAdmin = (req.method === 'GET' || req.method === 'DELETE') ?
    req.userAdmins[req.params.boardID] :
    req.userAdmins[req.body.boardID];

  if (!isAdmin) { return res.status(403); }
  next();
};

module.exports = useIsAdmin;
