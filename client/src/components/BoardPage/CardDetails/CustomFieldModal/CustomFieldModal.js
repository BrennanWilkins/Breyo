import React, { useState } from 'react';
import classes from './CustomFieldModal.module.css';
import ModalContainer from '../../../UI/ModalContainer/ModalContainer';
import PropTypes from 'prop-types';
import { plusIcon } from '../../../UI/icons';
import { BackBtn } from '../../../UI/Buttons/Buttons';
import AddCustomField from './AddCustomField/AddCustomField';
import { connect } from 'react-redux';
import { xIcon, editIcon, checkIcon } from '../../../UI/icons';
import { fieldIcons } from '../../../../utils/customFieldUtils';
import { deleteCustomField, updateCustomFieldTitle, customFieldDndHandler } from '../../../../store/actions';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const CustomFieldModal = props => {
  const [showAddField, setShowAddField] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [showEditTitle, setShowEditTitle] = useState('');

  const showEditHandler = (fieldID, fieldTitle) => {
    setShowEditTitle(fieldID);
    setTitleInput(fieldTitle);
  };

  const deleteHandler = fieldID => {
    if (showEditTitle) { return setShowEditTitle(''); }
    props.deleteField(fieldID);
  };

  const showAddFieldHandler = () => {
    setShowAddField(true);
    setShowEditTitle('');
  };

  const onDragEndHandler = ({ source, destination }) => {
    if (!destination) { return; }
    if (source.index === destination.index) { return; }
    props.moveField(source.index, destination.index);
  };

  const getDragStyle = (isDragging, otherStyles) => (
    isDragging ? { background: 'rgb(241, 241, 241)', ...otherStyles } : otherStyles
  );

  return (
    <ModalContainer close={props.close} className={classes.Container} title="Custom Fields">
      {showAddField ?
        <>
          <div className={classes.BackBtn}><BackBtn back={() => setShowAddField(false)} /></div>
          <AddCustomField close={() => setShowAddField(false)} />
        </>
        :
        <>
          <DragDropContext onDragEnd={onDragEndHandler}>
            <Droppable droppableId="fields" direction="vertical" type="list">
              {(provided, snapshot) => (
                <div ref={provided.innerRef}>
                  {props.customFields.map(({ fieldID, fieldType, fieldTitle }, i) => {
                    const isActive = showEditTitle === fieldID;
                    return (
                      <Draggable draggableId={fieldID} index={i} key={fieldID}>
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                          style={getDragStyle(snapshot.isDragging, provided.draggableProps.style)}
                          className={`${classes.Option} ${fieldType === 'Date' ? classes.DateField : ''} ${isActive ? classes.ActiveOption : ''}`}>
                            <span className={classes.FieldIcon}>{fieldIcons[fieldType]}</span>
                            {isActive ?
                              <input className={classes.TitleInput} value={titleInput} autoFocus onFocus={e => e.target.select()}
                              onChange={e => setTitleInput(e.target.value)} />
                              :
                              <span className={classes.Title}>{fieldTitle}</span>
                            }
                            <div className={classes.Btns}>
                              {isActive ?
                                <div className={classes.SaveBtn} onClick={() => props.updateTitle(fieldID, titleInput)}>{checkIcon}</div>
                                :
                                <div className={classes.EditBtn} onClick={() => showEditHandler(fieldID, fieldTitle)}>{editIcon}</div>
                              }
                              <div className={classes.DeleteBtn} onClick={() => deleteHandler(fieldID)}>{xIcon}</div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <div className={`${classes.Option} ${classes.AddBtn}`} onClick={showAddFieldHandler}>{plusIcon}New Field</div>
        </>
      }
    </ModalContainer>
  );
};

CustomFieldModal.propTypes = {
  close: PropTypes.func.isRequired,
  customFields: PropTypes.array.isRequired,
  deleteField: PropTypes.func.isRequired,
  updateTitle: PropTypes.func.isRequired,
  moveField: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  customFields: state.lists.currentCard.customFields
});

const mapDispatchToProps = dispatch => ({
  updateTitle: (fieldID, title) => dispatch(updateCustomFieldTitle(fieldID, title)),
  deleteField: fieldID => dispatch(deleteCustomField(fieldID)),
  moveField: (sourceIndex, destIndex) => dispatch(customFieldDndHandler(sourceIndex, destIndex))
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomFieldModal);
