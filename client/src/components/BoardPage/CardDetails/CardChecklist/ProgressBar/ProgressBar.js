import React, { useState, useRef, useEffect } from 'react';
import classes from './ProgressBar.module.css';

const ProgressBar = props => {
  const barRef = useRef();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const barWidth = barRef.current.getBoundingClientRect().width;
    setWidth(props.progress * barWidth);
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

export default ProgressBar;