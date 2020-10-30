const User = require('../models/user');

// middleware for validating if user is member of a board
const useIsMember = async (req, res, next) => {
  try {
    const user = await User.findById(req.userID);
    // boardID may be sent in params or body
    if (user.boards.findIndex(board => (String(board.boardID) === String(req.body.boardID)) || (String(board.boardID) === String(req.params.boardID))) < 0) {
      return res.status(401).json({ msg: 'MUST BE MEMBER' });
    }
    else { next(); }
  } catch(err) { res.sendStatus(500); }
};

module.exports = useIsMember;
