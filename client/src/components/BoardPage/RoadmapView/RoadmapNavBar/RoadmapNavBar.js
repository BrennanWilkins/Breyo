import React, { useState, useMemo } from 'react';
import classes from './RoadmapNavBar.module.css';
import PropTypes from 'prop-types';
import { ActionBtn } from '../../../UI/Buttons/Buttons';
import { chevronIcon } from '../../../UI/icons';
import SelectModal from '../SelectModal/SelectModal';
import { format, getYear } from 'date-fns';

const RoadmapNavBar = props => {
  const [showRangeSelect, setShowRangeSelect] = useState(false);
  const [showModeSelect, setShowModeSelect] = useState(false);

  const changeModeHandler = mode => {
    setShowModeSelect(false);
    props.changeMode(mode);
  };

  const changeRangeHandler = type => {
    setShowRangeSelect(false);
    props.changeRangeType(type);
  };

  const formattedRange = useMemo(() => {
    if (props.rangeType === 'Year') {
      return String(getYear(props.startDate));
    }
    return format(props.startDate, 'MMM yyyy');
  }, [props.rangeType, props.startDate]);

  return (
    <div className={classes.NavBar}>
      <div className={classes.CurrRange}>{formattedRange}</div>
      <div className={classes.DateBtns}>
        <ActionBtn className={`${classes.Btn} ${classes.PrevBtn}`} clicked={props.subRange}>{chevronIcon}</ActionBtn>
        <ActionBtn className={classes.Btn} clicked={props.moveToToday}>Today</ActionBtn>
        <ActionBtn className={`${classes.Btn} ${classes.NextBtn}`} clicked={props.addRange}>{chevronIcon}</ActionBtn>
      </div>
      <div className={classes.Sep} />
      <div className={classes.Relative}>
        <ActionBtn className={classes.Btn} clicked={() => setShowRangeSelect(true)}>{props.rangeType}{chevronIcon}</ActionBtn>
        {showRangeSelect &&
          <SelectModal close={() => setShowRangeSelect(false)} options={['Year', 'Month', 'Week']}
          optionSelected={changeRangeHandler} active={props.rangeType} />
        }
      </div>
      <div className={classes.Relative}>
        <ActionBtn className={classes.Btn} clicked={() => setShowModeSelect(true)}>{props.roadmapMode}{chevronIcon}</ActionBtn>
        {showModeSelect &&
          <SelectModal close={() => setShowModeSelect(false)} options={['List', 'Member', 'Label']}
          optionSelected={changeModeHandler} active={props.roadmapMode} />
        }
      </div>
    </div>
  );
};

RoadmapNavBar.propTypes = {
  roadmapMode: PropTypes.string.isRequired,
  rangeType: PropTypes.string.isRequired,
  startDate: PropTypes.instanceOf(Date),
  changeMode: PropTypes.func.isRequired,
  changeRangeType: PropTypes.func.isRequired,
  moveToToday: PropTypes.func.isRequired,
  subRange: PropTypes.func.isRequired,
  addRange: PropTypes.func.isRequired
};

export default RoadmapNavBar;
