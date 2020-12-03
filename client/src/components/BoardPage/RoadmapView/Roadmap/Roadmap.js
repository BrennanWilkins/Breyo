import React from 'react';
import classes from './Roadmap.module.css';
import PropTypes from 'prop-types';

const Roadmap = props => {
  return (
    <div className={classes.Container} style={(props.cardsShown && props.listsShown) ? { width: 'calc(100% - 600px)', left: '300px' } :
    props.cardsShown ? { width: 'calc(100% - 300px)' } : props.listsShown ? { width: 'calc(100% - 300px)', left: '300px' } : null}>
    </div>
  );
};

Roadmap.propTypes = {
  cardsShown: PropTypes.bool.isRequired,
  listsShown: PropTypes.bool.isRequired
};

export default Roadmap;
