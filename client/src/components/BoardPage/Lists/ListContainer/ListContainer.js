import React from 'react';
import classes from './ListContainer.module.css';
import { connect } from 'react-redux';
import List from '../List/List';
import AddList from '../AddList/AddList';

const ListContainer = props => (
  <div className={classes.Container}>
    {props.lists.map(list => <List key={list.listID} {...list} boardID={props.boardID} />)}
    <AddList listCount={props.lists.length} boardID={props.boardID} />
  </div>
);

const mapStateToProps = state => ({
  lists: state.lists.lists,
  boardID: state.board.boardID
});

export default connect(mapStateToProps)(ListContainer);
