import React, { useState, useRef, useEffect } from 'react';
import classes from './ProgressBar.module.css';
import PropTypes from 'prop-types';

const ProgressBar = props => {
  const barRef = useRef();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const resizeHandler = () => {
      const barWidth = barRef.current.getBoundingClientRect().width;
      setWidth(props.progress * barWidth);
    };

    resizeHandler();

    // update progress width on window resize
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, [props.progress]);

  return (
    <div className={classes.Container}>
      <div className={classes.Percent}>{Math.floor(props.progress * 100)}%</div>
      <div ref={barRef} className={classes.Bar}>
        <div className={classes.Overlay} style={{ width: width + 'px' }}></div>
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired
};

export default ProgressBar;
