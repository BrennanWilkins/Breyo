const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const config = require('config');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const boardRouter = require('./routes/board');
const listRouter = require('./routes/list');
const cardRouter = require('./routes/card');
const activityRouter = require('./routes/activity');
const teamRouter = require('./routes/team');
const initSocket = require('./socket/socket');

const app = express();

const server = require('http').createServer(app);

initSocket(server);

const mongoose = require('mongoose');
mongoose.connect(config.get('DB_URL'), { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, autoIndex: false });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(cors());
app.use(logger('dev'));
app.use('/api/user/avatar', express.json({ limit: '5mb' }));
app.use('/api/team/logo', express.json({ limit: '5mb' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRouter);
app.use('/api/board', boardRouter);
app.use('/api/list', listRouter);
app.use('/api/card', cardRouter);
app.use('/api/activity', activityRouter);
app.use('/api/team', teamRouter);
app.use('/api/user', userRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 9000;
server.listen(port, () => console.log(`Server started on port ${port}`));

module.exports = app;
