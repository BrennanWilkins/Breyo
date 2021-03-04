import React, { useState, useRef } from 'react';
import classes from './RoadmapContainer.module.css';
import PropTypes from 'prop-types';
import RoadmapNavBar from '../RoadmapNavBar/RoadmapNavBar';
import DateBar from '../DateBar/DateBar';
import LaneTypes from '../LaneTypes/LaneTypes';
import { format, startOfMonth, endOfMonth, getYear, startOfYear,
  endOfYear, startOfWeek, endOfWeek, isThisWeek, isThisMonth, isThisYear,
  addWeeks, subWeeks, addMonths, subMonths, addYears, subYears } from 'date-fns';

const RoadmapContainer = props => {
  const [roadmapMode, setRoadmapMode] = useState('List');
  const [dateRange, setDateRange] = useState({
    type: 'Month',
    currRangeFormatted: format(new Date(), 'MMM yyyy'),
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date())
  });
  const dateRef = useRef();

  const changeRangeTypeHandler = type => {
    if (type === dateRange.type) { return; }
    setDateRange(range => ({
      type,
      currRangeFormatted: type === 'Year' ?
        String(getYear(range.startDate)) :
        format(range.startDate, 'MMM yyyy'),
      startDate: type === 'Year' ?
        startOfYear(range.startDate) :
        type === 'Month' ?
        startOfMonth(range.startDate) :
        startOfWeek(range.startDate),
      endDate: type === 'Year' ?
        endOfYear(range.endDate) :
        type === 'Month' ?
        endOfMonth(range.startDate) :
        endOfWeek(range.startDate)
    }));
  };

  const moveToTodayHandler = () => {
    if (dateRange.type === 'Week') {
      if (isThisWeek(dateRange.startDate)) { return; }
      setDateRange({
        type: 'Week',
        currRangeFormatted: format(new Date(), 'MMM yyyy'),
        startDate: startOfWeek(new Date()),
        endDate: endOfWeek(new Date())
      });
    } else if (dateRange.type === 'Month') {
      if (isThisMonth(dateRange.startDate)) { return; }
      setDateRange({
        type: 'Month',
        currRangeFormatted: format(new Date(), 'MMM yyyy'),
        startDate: startOfMonth(new Date()),
        endDate: endOfMonth(new Date())
      });
    } else {
      if (isThisYear(dateRange.startDate)) { return; }
      setDateRange({
        type: 'Year',
        currRangeFormatted: String(getYear(new Date())),
        startDate: startOfYear(new Date()),
        endDate: endOfYear(new Date())
      });
    }
  };

  const subRangeHandler = () => {
    if (dateRange.type === 'Week') {
      let startDate = subWeeks(dateRange.startDate, 1);
      setDateRange({
        type: 'Week',
        currRangeFormatted: format(startDate, 'MMM yyyy'),
        startDate,
        endDate: endOfWeek(startDate)
      });
    } else if (dateRange.type === 'Month') {
      let startDate = subMonths(dateRange.startDate, 1);
      setDateRange({
        type: 'Month',
        currRangeFormatted: format(startDate, 'MMM yyyy'),
        startDate,
        endDate: endOfMonth(startDate)
      });
    } else {
      let startDate = subYears(dateRange.startDate, 1);
      setDateRange({
        type: 'Year',
        currRangeFormatted: String(getYear(startDate)),
        startDate,
        endDate: endOfYear(startDate)
      });
    }
  };

  const addRangeHandler = () => {
    if (dateRange.type === 'Week') {
      let startDate = addWeeks(dateRange.startDate, 1);
      setDateRange({
        type: 'Week',
        currRangeFormatted: format(startDate, 'MMM yyyy'),
        startDate,
        endDate: endOfWeek(startDate)
      });
    } else if (dateRange.type === 'Month') {
      let startDate = addMonths(dateRange.startDate, 1);
      setDateRange({
        type: 'Month',
        currRangeFormatted: format(startDate, 'MMM yyyy'),
        startDate,
        endDate: endOfMonth(startDate)
      });
    } else {
      let startDate = addYears(dateRange.startDate, 1);
      setDateRange({
        type: 'Year',
        currRangeFormatted: String(getYear(startDate)),
        startDate,
        endDate: endOfYear(startDate)
      });
    }
  };

  return (
    <div className={classes.Container} style={props.menuShown ? {width: 'calc(100% - 350px)'} : null}>
      <RoadmapNavBar roadmapMode={roadmapMode} rangeType={dateRange.type} formattedRange={dateRange.currRangeFormatted}
      changeMode={mode => setRoadmapMode(mode)} changeRangeType={changeRangeTypeHandler} moveToToday={moveToTodayHandler}
      subRange={subRangeHandler} addRange={addRangeHandler} />
      <div className={classes.RoadmapContainer}>
        <LaneTypes mode={roadmapMode} />
        <DateBar rangeType={dateRange.type} startDate={dateRange.startDate} endDate={dateRange.endDate} />
      </div>
    </div>
  );
};

RoadmapContainer.propTypes = {
  menuShown: PropTypes.bool.isRequired
};

export default RoadmapContainer;
