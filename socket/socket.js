const socketIO = require('socket.io');
const boardSocketRoutes = require('./boardSocketRoutes');
const teamSocketRoutes = require('./teamSocketRoutes');
const config = require('config');
const jwt = require('jsonwebtoken');

const initSocket = server => {
  const io = socketIO(server, { cors: true });

  const boardNamespace = io.of('/boards');
  const teamNamespace = io.of('/teams');

  boardNamespace.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token) {
      jwt.verify(socket.handshake.query.token, config.get('AUTH_KEY'), (err, decoded) => {
        if (err) { return next(new Error('Unauthorized')); }
        socket.userBoards = decoded.user.userMembers;
        next();
      });
    } else { next(new Error('Unauthorized')); }
  }).on('connection', socket => {
    socket.on('join', room => {
      // verify user is member of board
      if (!socket.userBoards[room]) { return socket.emit('unauthorized', 'Not a board member'); }
      socket.join(room);
      socket.room = room;
      socket.emit('joined', 'User successfully joined board');
    });
    for (let route of boardSocketRoutes) {
      socket.on(route, msg => {
        socket.to(socket.room).emit(route, msg);
      });
    }
  });

  teamNamespace.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token) {
      jwt.verify(socket.handshake.query.token, config.get('AUTH_KEY'), (err, decoded) => {
        if (err) { return next(new Error('Unauthorized')); }
        socket.userTeams = decoded.user.userTeams;
        next();
      });
    } else { next(new Error('Unauthorized')); }
  }).on('connection', socket => {
    socket.on('join', room => {
      // verify user is member of team
      if (!socket.userTeams[room]) { return socket.emit('unauthorized', 'Not a team member'); }
      socket.join(room);
      socket.room = room;
      socket.emit('joined', 'User successfully joined team');
    });
    for (let route of teamSocketRoutes) {
      socket.on(route, msg => {
        socket.to(socket.room).emit(route, msg);
      });
    }
  });
};

module.exports = initSocket;
