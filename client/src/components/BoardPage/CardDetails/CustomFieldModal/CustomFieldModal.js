import React, { useState } from 'react';
import classes from './CustomFieldModal.module.css';
import ModalContainer from '../../../UI/ModalContainer/ModalContainer';
import PropTypes from 'prop-types';
import { plusIcon } from '../../../UI/icons';
import { BackBtn, DeleteBtn } from '../../../UI/Buttons/Buttons';
import CreateCustomField from './CreateCustomField/CreateCustomField';
import { connect } from 'react-redux';
import { xIcon, editIcon, checkIcon } from '../../../UI/icons';
import { fieldIcons } from '../../../../utils/customFieldUtils';
import { deleteCustomField, deleteCustomFieldFromCard, updateCustomFieldTitle,
  customFieldDndHandler, addCustomField } from '../../../../store/actions';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const CustomFieldModal = props => {
  const [showAddField, setShowAddField] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [showEditTitle, setShowEditTitle] = useState('');
  const [showDeleteField, setShowDeleteField] = useState(null);

  const showEditHandler = (e, fieldID, fieldTitle) => {
    e.stopPropagation();
    setShowEditTitle(fieldID);
    setTitleInput(fieldTitle);
  };

  const deleteHandler = (e, fieldID, fieldTitle) => {
    e.stopPropagation();
    if (showEditTitle) { return setShowEditTitle(''); }
    setShowDeleteField({ fieldID, fieldTitle });
  };

  const deleteFieldHandler = () => {
    props.deleteField(showDeleteField.fieldID);
    setShowDeleteField(null);
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

  const updateTitleHandler = (e, fieldID, titleInput) => {
    e.stopPropagation();
    props.updateTitle(fieldID, titleInput);
    setShowEditTitle('');
  };

  const backHandler = () => {
    setShowAddField(false);
    setShowDeleteField(null);
  };

  const toggleCustomFieldHandler = (fieldID, fieldType, isIncluded) => {
    if (showEditTitle) { return; }
    if (isIncluded) { props.deleteFieldFromCard(fieldID); }
    else { props.addCustomField(fieldID, fieldType); }
  };

  return (
    <ModalContainer close={props.close} className={classes.Container} title={!!showDeleteField ? `Delete ${showDeleteField.fieldTitle}?` : 'Custom Fields'}>
      {(!!showDeleteField || showAddField) && <div className={classes.BackBtn}><BackBtn back={backHandler} /></div>}
      {showAddField ?
        <CreateCustomField close={() => setShowAddField(false)} />
        :
        showDeleteField ?
        <>
          <p className={classes.SubTitle}>Are you sure you want to delete this field? This will cause it to be deleted from all cards.</p>
          <DeleteBtn clicked={deleteFieldHandler}>Delete</DeleteBtn>
        </>
        :
        <>
          <DragDropContext onDragEnd={onDragEndHandler}>
            <Droppable droppableId="fields" direction="vertical" type="list">
              {(provided, snapshot) => (
                <div ref={provided.innerRef}>
                  {props.allFields.map((fieldID, i) => {
                    const { fieldTitle, fieldType } = props.customFieldsByID[fieldID];
                    const isActive = showEditTitle === fieldID;
                    const isIncluded = !!props.cardCustomFields.find(field => field.fieldID === fieldID);
                    return (
                      <Draggable draggableId={fieldID} index={i} key={fieldID}>
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                          style={getDragStyle(snapshot.isDragging, provided.draggableProps.style)}
                          className={`${classes.Option} ${fieldType === 'Date' ? classes.DateField : ''} ${isActive ? classes.ActiveOption : ''}`}
                          onClick={() => toggleCustomFieldHandler(fieldID, fieldType, isIncluded)}>
                            <span className={classes.FieldIcon}>{fieldIcons[fieldType]}</span>
                            {isActive ?
                              <input className={classes.TitleInput} value={titleInput} autoFocus onFocus={e => e.target.select()}
                              onChange={e => setTitleInput(e.target.value)} />
                              :
                              <span className={classes.Title}>{fieldTitle}</span>
                            }
                            <div className={classes.Btns}>
                              {isActive ?
                                <div className={classes.SaveBtn} onClick={e => updateTitleHandler(e, fieldID, titleInput)}>{checkIcon}</div>
                                :
                                <div className={classes.EditBtn} onClick={e => showEditHandler(e, fieldID, fieldTitle)}>{editIcon}</div>
                              }
                              <div className={classes.DeleteBtn} onClick={e => deleteHandler(e, fieldID, fieldTitle)}>{xIcon}</div>
                            </div>
                            {(isIncluded && !showEditTitle) && <span className={classes.CheckIcon}>{checkIcon}</span>}
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
  cardCustomFields: PropTypes.array.isRequired,
  deleteField: PropTypes.func.isRequired,
  updateTitle: PropTypes.func.isRequired,
  moveField: PropTypes.func.isRequired,
  allFields: PropTypes.array.isRequired,
  customFieldsByID: PropTypes.object.isRequired,
  deleteFieldFromCard: PropTypes.func.isRequired,
  addCustomField: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  cardCustomFields: state.lists.currentCard.customFields,
  allFields: state.board.customFields.allIDs,
  customFieldsByID: state.board.customFields.byID
});

const mapDispatchToProps = dispatch => ({
  updateTitle: (fieldID, title) => dispatch(updateCustomFieldTitle(fieldID, title)),
  deleteField: fieldID => dispatch(deleteCustomField(fieldID)),
  addCustomField: (fieldID, fieldType) => dispatch(addCustomField(fieldID, fieldType)),
  deleteFieldFromCard: fieldID => dispatch(deleteCustomFieldFromCard(fieldID)),
  moveField: (sourceIndex, destIndex) => dispatch(customFieldDndHandler(sourceIndex, destIndex))
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomFieldModal);
