import React, { useState } from 'react';
import classes from './RoadmapNavBar.module.css';
import PropTypes from 'prop-types';
import { ActionBtn } from '../../../UI/Buttons/Buttons';
import { chevronIcon } from '../../../UI/icons';
import SelectModal from '../SelectModal/SelectModal';

const RoadmapNavBar = props => {
  const [showDateSelect, setShowDateSelect] = useState(false);
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

  return (
    <div className={classes.NavBar}>
      <div className={classes.CurrRange}>{props.formattedRange}</div>
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
  formattedRange: PropTypes.string.isRequired,
  changeMode: PropTypes.func.isRequired,
  changeRangeType: PropTypes.func.isRequired,
  moveToToday: PropTypes.func.isRequired,
  subRange: PropTypes.func.isRequired,
  addRange: PropTypes.func.isRequired
};

export default RoadmapNavBar;
