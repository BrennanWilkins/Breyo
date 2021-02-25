import React, { useState, useRef } from 'react';
import classes from './BoardOverview.module.css';
import PropTypes from 'prop-types';
import { pieChartIcon, barChartIcon, dotsIcon } from '../../UI/icons';
import { useModalToggle } from '../../../utils/customHooks';

const OverviewCard = props => {
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef();
  useModalToggle(showOptions, optionsRef, () => setShowOptions(false));

  const modeHandler = mode => {
    setShowOptions(false);
    if (mode === props.mode) { return; }
    props.changeMode(mode);
  };

  return (
    <div className={classes.DataCard}>
      <div className={classes.Title}>
        {props.title}
        <div className={classes.Options}>
          <div className={classes.OptionsBtn} onClick={() => setShowOptions(true)}>{dotsIcon}</div>
          {showOptions &&
            <div className={classes.CardOptions} ref={optionsRef}>
              <div className={classes.Option} onClick={() => modeHandler('pie')}>
                {pieChartIcon} View as pie chart
              </div>
              <div className={classes.Option} onClick={() => modeHandler('bar')}>
                {barChartIcon} View as bar chart
              </div>
            </div>
          }
        </div>
      </div>
      {props.children}
    </div>
  );
};

OverviewCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.object.isRequired,
  mode: PropTypes.string.isRequired,
  changeMode: PropTypes.func.isRequired
};

export default OverviewCard;
