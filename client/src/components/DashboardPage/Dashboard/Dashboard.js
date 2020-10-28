import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classes from './Dashboard.module.css';
import { connect } from 'react-redux';
import { getUserData } from '../../../store/actions';
import NavBar from '../../NavBar/NavBar/NavBar';

const Dashboard = props => {
  useEffect(() => props.getUserData(), []);

  return (
    <div>
      <NavBar />
    </div>
  );
};

Dashboard.propTypes = {
  getUserData: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  getUserData: () => dispatch(getUserData())
});

export default connect(null, mapDispatchToProps)(Dashboard);
