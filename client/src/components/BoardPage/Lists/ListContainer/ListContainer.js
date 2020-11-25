import React from 'react';
import classes from './ListContainer.module.css';
import { connect } from 'react-redux';
import List from '../List/List';
import AddList from '../AddList/AddList';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { dndHandler } from '../../../../store/actions';
import PropTypes from 'prop-types';

const ListContainer = props => {
  const onDragEndHandler = ({ source, destination }) => {
    // list/card dropped in invalid place
    if (!destination) { return; }
    // list/card dropped in original place
    if (source.index === destination.index && source.droppableId === destination.droppableId) { return; }
    props.dndHandler(source, destination, props.boardID);
  };

  return (
    <DragDropContext onDragEnd={onDragEndHandler}>
      <Droppable droppableId="droppable" direction="horizontal" type="list">
        {(provided, snapshot) => (
          <div className={classes.Container} ref={provided.innerRef} style={props.showMenu ? {width: 'calc(100% - 350px)'} : null}>
            {props.lists.map(list => <List key={list.listID} {...list} boardID={props.boardID} />)}
            {provided.placeholder}
            <AddList listCount={props.lists.length} boardID={props.boardID} />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

ListContainer.propTypes = {
  lists: PropTypes.array.isRequired,
  boardID: PropTypes.string.isRequired,
  dndHandler: PropTypes.func.isRequired,
  showMenu: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  lists: state.lists.lists,
  boardID: state.board.boardID
});

const mapDispatchToProps = dispatch => ({
  dndHandler: (source, destination, boardID) => dispatch(dndHandler(source, destination, boardID))
});

export default connect(mapStateToProps, mapDispatchToProps)(ListContainer);
