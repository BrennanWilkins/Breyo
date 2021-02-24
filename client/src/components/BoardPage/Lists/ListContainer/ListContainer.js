import React from 'react';
import classes from './ListContainer.module.css';
import { connect } from 'react-redux';
import List from '../List/List';
import AddList from '../AddList/AddList';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { dndHandler } from '../../../../store/actions';
import PropTypes from 'prop-types';

const ListContainer = props => {
  const onDragEndHandler = ({ source, destination, draggableId }) => {
    // list/card dropped in invalid place
    if (!destination) { return; }
    // list/card dropped in original place
    if (source.index === destination.index && source.droppableId === destination.droppableId) { return; }
    props.dndHandler(source, destination, draggableId, props.boardID);
  };

  const lists = props.cardsAreFiltered ? props.filteredLists : props.lists;

  return (
    <DragDropContext onDragEnd={onDragEndHandler}>
      <Droppable droppableId="droppable" direction="horizontal" type="list">
        {(provided, snapshot) => (
          <div className={classes.Container} ref={provided.innerRef} style={props.menuShown ? {width: 'calc(100% - 350px)'} : null}>
            {lists.map(list => <List key={list.listID} {...list} boardID={props.boardID} />)}
            {provided.placeholder}
            <AddList listCount={props.lists.length} />
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
  menuShown: PropTypes.bool.isRequired,
  cardsAreFiltered: PropTypes.bool.isRequired,
  filteredLists: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  lists: state.lists.lists,
  boardID: state.board.boardID,
  cardsAreFiltered: state.lists.cardsAreFiltered,
  filteredLists: state.lists.filteredLists
});

const mapDispatchToProps = dispatch => ({
  dndHandler: (source, destination, draggableID, boardID) => dispatch(dndHandler(source, destination, draggableID, boardID))
});

export default connect(mapStateToProps, mapDispatchToProps)(ListContainer);
