import React from 'react';
import classes from './RoadmapCardsMenu.module.css';
import PropTypes from 'prop-types';
import MenuToggle from '../../../UI/MenuToggle/MenuToggle';

const RoadmapCardsMenu = props => {
  return (
    <div className={props.show ? classes.Container : classes.Hide}>
      <MenuToggle onLeft collapsed={!props.show} toggle={props.toggle} />
    </div>
  );
};

RoadmapCardsMenu.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired
};

export default RoadmapCardsMenu;
