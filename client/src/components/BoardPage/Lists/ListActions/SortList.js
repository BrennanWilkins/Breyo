import React from 'react';
import classes from './ListActions.module.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sortList } from '../../../../store/actions';

const SortList = props => (
  <div className={classes.ViewContainer}>
    <div className={classes.Options}>
      <div onClick={() => props.sortList(props.listID, 'newest')}>Date Created (Newest First)</div>
      <div onClick={() => props.sortList(props.listID, 'oldest')}>Date Created (Oldest First)</div>
      <div onClick={() => props.sortList(props.listID, 'due')}>Due Date</div>
      <div onClick={() => props.sortList(props.listID, 'AtoZ')}>Card Name (A to Z)</div>
      <div onClick={() => props.sortList(props.listID, 'ZtoA')}>Card Name (Z to A)</div>
    </div>
  </div>
);

SortList.propTypes = {
  listID: PropTypes.string.isRequired,
  sortList: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  sortList: (listID, mode) => dispatch(sortList(listID, mode))
});

export default connect(null, mapDispatchToProps)(SortList);
