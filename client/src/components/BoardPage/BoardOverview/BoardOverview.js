import React, { useState, useEffect } from 'react';
import classes from './BoardOverview.module.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { pieChartIcon, barChartIcon } from '../../UI/icons';
import { ActionBtn } from '../../UI/Buttons/Buttons';

const BoardOverview = props => {
  return (
    <div className={`${classes.Container} ${props.menuShown ? classes.ContainerSmall : ''}`}>
      <div className={classes.DataCard}>
        <div className={classes.Title}>
          Cards per list
          <div className={classes.ChartBtns}>
            <ActionBtn>{pieChartIcon} Pie Chart</ActionBtn>
            <ActionBtn>{barChartIcon} Bar Chart</ActionBtn>
          </div>
        </div>
      </div>
      <div className={classes.DataCard}>
        <div className={classes.Title}>
          Cards per member
          <div className={classes.ChartBtns}>
            <ActionBtn>{pieChartIcon} Pie Chart</ActionBtn>
            <ActionBtn>{barChartIcon} Bar Chart</ActionBtn>
          </div>
        </div>
      </div>
      <div className={classes.DataCard}>
        <div className={classes.Title}>
          Cards per due date
          <div className={classes.ChartBtns}>
            <ActionBtn>{pieChartIcon} Pie Chart</ActionBtn>
            <ActionBtn>{barChartIcon} Bar Chart</ActionBtn>
          </div>
        </div>
      </div>
      <div className={classes.DataCard}>
        <div className={classes.Title}>
          Cards per label
          <div className={classes.ChartBtns}>
            <ActionBtn>{pieChartIcon} Pie Chart</ActionBtn>
            <ActionBtn>{barChartIcon} Bar Chart</ActionBtn>
          </div>
        </div>
      </div>
    </div>
  );
};

BoardOverview.propTypes = {
  menuShown: PropTypes.bool.isRequired,
  lists: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  lists: state.lists.lists
});

export default connect(mapStateToProps)(BoardOverview);
