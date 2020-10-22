const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const config = require('config');
const authRouter = require('./routes/auth');
const boardRouter = require('./routes/board');
const cardRouter = require('./routes/card');
const listRouter = require('./routes/list');

const app = express();

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.connect(config.get('DB_URL'), { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRouter);
app.use('/api/board', boardRouter);
app.use('/api/list', listRouter);
app.use('/api/card', cardRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 9000;
app.listen(port, () => console.log(`Server started on port ${port}`));

module.exports = app;
