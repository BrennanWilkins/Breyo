import React from 'react';
import classes from './DateBars.module.css';
import PropTypes from 'prop-types';
import { eachMonthOfInterval, eachDayOfInterval, format, isThisMonth, isToday, isWeekend } from 'date-fns';

const DateBars = props => (
  <div className={classes.DateBars} style={{ minHeight: props.totalHeight }}>
    {props.rangeType === 'Year' ?
      eachMonthOfInterval({ start: props.startDate, end: props.endDate }).map((date, i) => (
        <div style={{ width: props.dateWidth }} key={String(date)}
        className={`${classes.Date} ${isThisMonth(date) ? classes.Highlight : ''}`}>
          <div className={classes.DateTop}>
            <div className={classes.DateVal}>{format(date, 'LLL')}</div>
          </div>
        </div>
      ))
      :
      eachDayOfInterval({ start: props.startDate, end: props.endDate }).map((date, i) => (
        <div style={{ width: props.dateWidth }} key={String(date)}
        className={`${classes.Date} ${isToday(date) ? classes.Highlight : isWeekend(date) ? classes.WkndHighlight : ''}`}>
          <div className={classes.DateTop}>
            <div className={classes.Day}>{format(date, 'EEE')}</div>
            <div className={classes.DateVal}>{format(date, 'LLL d')}</div>
          </div>
        </div>
      ))
    }
  </div>
);

DateBars.propTypes = {
  rangeType: PropTypes.string.isRequired,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  dateWidth: PropTypes.number.isRequired,
  totalHeight: PropTypes.string.isRequired
};

export default DateBars;
