const jwt = require('jsonwebtoken');
const config = require('config');

// verify jwt token from user, sets user._id as req.userID
// req.userMembers set as all boards user is member of
// req.userAdmins set as all boards user is admin of
module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (token) {
    jwt.verify(token, config.get('AUTH_KEY'), (err, decoded) => {
      if (err) {
        return res.status(401).json({ msg: 'TOKEN NOT VALID' });
      }
      req.userID = decoded.user._id;
      req.email = decoded.user.email;
      req.fullName = decoded.user.fullName;
      req.userMembers = {};
      req.userAdmins = {};
      for (let board of decoded.user.boards) {
        req.userMembers[board.boardID] = true;
        if (board.isAdmin) { req.userAdmins[board.boardID] = true; }
      }
      next();
    });
  } else {
    res.status(401).json({ msg: 'TOKEN NOT RECEIVED' });
  }
};
