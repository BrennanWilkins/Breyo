import React, { useState, useEffect } from 'react';
import classes from './QueryCountBtn.module.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CloseBtn } from '../Buttons/Buttons';
import { resetSearchQuery } from '../../../store/actions';

const QueryCountBtn = props => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let count = props.filteredLists.reduce((totCount, list) => totCount + list.cards.length, 0);
    setCount(count);
  }, [props.filteredLists]);

  return (
    <div className={classes.QueryCountBtn} onClick={props.openMenu}>
      {count} search {count === 1 ? 'result' : 'results'}
      <span className={classes.CloseBtn} onClick={e => e.stopPropagation()}>
        <CloseBtn close={props.resetSearchQuery} />
      </span>
    </div>
  );
};

QueryCountBtn.propTypes = {
  filteredLists: PropTypes.array.isRequired,
  resetSearchQuery: PropTypes.func.isRequired,
  openMenu: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  filteredLists: state.lists.filteredLists
});

const mapDispatchToProps = dispatch => ({
  resetSearchQuery: () => dispatch(resetSearchQuery())
});

export default connect(mapStateToProps, mapDispatchToProps)(QueryCountBtn);
