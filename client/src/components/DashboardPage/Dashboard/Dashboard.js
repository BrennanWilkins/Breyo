import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classes from './Dashboard.module.css';
import { connect } from 'react-redux';
import { getUserData } from '../../../store/actions';
import BoardList from '../BoardList/BoardList';
import { personIcon, starIcon } from '../../UI/icons';

const Dashboard = props => {
  useEffect(() => props.getUserData(), []);

  const starredBoards = props.boards.filter(board => board.isStarred);

  return (
    <div className={classes.Container}>
      {starredBoards.length > 0 && <>
      <div className={classes.Title}>{starIcon} Starred Boards</div>
      <BoardList boards={starredBoards} /></>}
      <div className={classes.Title}>{personIcon} My Boards</div>
      <BoardList boards={props.boards} isMyBoards />
    </div>
  );
};

Dashboard.propTypes = {
  getUserData: PropTypes.func.isRequired,
  boards: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  boards: state.auth.boards
});

const mapDispatchToProps = dispatch => ({
  getUserData: () => dispatch(getUserData())
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
