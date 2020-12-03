import React from 'react';
import classes from './MenuToggle.module.css';
import PropTypes from 'prop-types';
import { backIcon } from '../icons';

const MenuToggle = props => (
  <div onClick={props.toggle} className={`${classes.MenuToggle} ${props.onLeft ? classes.Left : classes.Right}`}>
    <span className={`${classes.Icon} ${props.collapsed ? classes.Collapsed : classes.Expanded}`}>{backIcon}</span>
  </div>
);

MenuToggle.propTypes = {
  collapsed: PropTypes.bool,
  toggle: PropTypes.func.isRequired,
  onLeft: PropTypes.bool
};

export default MenuToggle;
