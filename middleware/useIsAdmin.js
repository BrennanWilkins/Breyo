const User = require('../models/user');

// middleware for validating if user is admin of a board
const useIsAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.userID });
    // boardID may be sent in body or in params
    const isAdmin = user.boards.find(board => (board._id === req.body.boardID || board._id === req.params.boardID) && board.isAdmin);
    if (!isAdmin) { res.status(401).json({ msg: 'MUST BE ADMIN' }); }
    else { next(); }
  } catch(err) { res.sendStatus(500); }
};

module.exports = useIsAdmin;
