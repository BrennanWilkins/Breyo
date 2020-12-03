import React from 'react';
import classes from './RoadmapListsMenu.module.css';
import MenuToggle from '../../../UI/MenuToggle/MenuToggle';
import PropTypes from 'prop-types';

const RoadmapListsMenu = props => {
  return (
    <div className={props.show ? classes.Container : classes.Hide}>
      <MenuToggle collapsed={!props.show} toggle={props.toggle} />
    </div>
  );
};

RoadmapListsMenu.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired
};

export default RoadmapListsMenu;
