import React, { useEffect, useState } from 'react';
import classes from './DateBar.module.css';
import PropTypes from 'prop-types';
import { eachMonthOfInterval, eachDayOfInterval, format, isThisMonth, isToday } from 'date-fns';

const DateBar = props => {
  const [dates, setDates] = useState([]);

  useEffect(() => {
    if (props.rangeType === 'Year') {
      setDates(eachMonthOfInterval({ start: props.startDate, end: props.endDate }).map((date, i) => (
        <div ref={i === 0 ? props.dateRef : null} key={String(date)} className={`${classes.Date} ${isThisMonth(date) ? classes.Highlight : ''}`}>
          <div className={classes.DateTop}>
            <div className={classes.DateVal}>{format(date, 'LLL')}</div>
          </div>
        </div>
      )));
    } else {
      setDates(eachDayOfInterval({ start: props.startDate, end: props.endDate }).map((date, i) => (
        <div ref={i === 0 ? props.dateRef : null} key={String(date)} className={`${classes.Date} ${isToday(date) ? classes.Highlight : ''}`}>
          <div className={classes.DateTop}>
            <div>{format(date, 'EEE')}</div>
            <div className={classes.DateVal}>{format(date, 'LLL d')}</div>
          </div>
        </div>
      )));
    }
  }, [props.rangeType, props.startDate, props.endDate]);

  return <div className={classes.DateBar}>{dates}</div>;
};

DateBar.propTypes = {
  rangeType: PropTypes.string.isRequired,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  dateRef: PropTypes.object.isRequired
};

export default React.memo(DateBar);
