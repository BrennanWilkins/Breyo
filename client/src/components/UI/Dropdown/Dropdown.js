import React, { useEffect } from 'react';
import classes from './Dropdown.module.css';
import PropTypes from 'prop-types';

const Dropdown = props => {
  useEffect(() => {
    const resizeHandler = () => {
      // if dropdown not shown make sure document overflow is correct
      if (window.innerWidth > props.max) { props.close(); }
    };

    if (props.show) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('resize', resizeHandler);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => window.removeEventListener('resize', resizeHandler);
  }, [props.show, props.max]);

  useEffect(() => {
    return () => document.body.style.overflow = 'auto';
  }, []);

  return (
    <div className={props.show ? classes.Dropdown : `${classes.Dropdown} ${classes.Hide}`}>
      {props.children}
    </div>
  );
};

Dropdown.propTypes = {
  show: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  max: PropTypes.number.isRequired
};

export default Dropdown;
