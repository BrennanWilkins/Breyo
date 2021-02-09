import React, { useState, useEffect, useRef } from 'react';
import classes from './CustomFieldModal.module.css';
import ModalContainer from '../../../UI/ModalContainer/ModalContainer';
import PropTypes from 'prop-types';
import { plusIcon } from '../../../UI/icons';
import { BackBtn } from '../../../UI/Buttons/Buttons';
import AddCustomField from './AddCustomField/AddCustomField';
import { connect } from 'react-redux';
import { xIcon, editIcon, checkIcon } from '../../../UI/icons';
import { fieldIcons } from '../../../../utils/customFieldUtils';
import { deleteCustomField, updateCustomFieldTitle } from '../../../../store/actions';

const CustomFieldModal = props => {
  const [showAddField, setShowAddField] = useState(false);
  const [showEditTitle, setShowEditTitle] = useState({ fieldID: '', fieldTitle: '' });
  const [titleInput, setTitleInput] = useState('');
  const editBtnRef = useRef();
  const inputRef = useRef();

  const editHandler = (isActive, fieldID, fieldTitle) => {
    if (isActive) {
      if (!titleInput || titleInput.length > 150 || titleInput === showEditTitle.fieldTitle) { return setTitleInput(''); }
      props.updateTitle(showEditTitle.fieldID, titleInput);
      return setShowEditTitle({ fieldID: '', fieldTitle: '' });
    }
    setShowEditTitle({ fieldID, fieldTitle });
    setTitleInput(fieldTitle);
  };

  useEffect(() => {
    const clickHandler = e => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        if (editBtnRef && !editBtnRef.current.contains(e.target)) { setShowEditTitle({ fieldID: '', fieldTitle: '' }); }
        e.stopPropagation();
        document.removeEventListener('mousedown', clickHandler);
      }
    };

    if (showEditTitle.fieldID) { document.addEventListener('mousedown', clickHandler); }
    return () => document.removeEventListener('mousedown', clickHandler);
  }, [showEditTitle]);

  return (
    <ModalContainer close={props.close} className={classes.Container} title="Custom Fields">
      {showAddField ?
        <>
          <div className={classes.BackBtn}><BackBtn back={() => setShowAddField(false)} /></div>
          <AddCustomField close={() => setShowAddField(false)} />
        </>
        :
        <>
          {props.customFields.map(({ fieldID, fieldType, fieldTitle }) => {
            const isActive = showEditTitle.fieldID === fieldID;
            return (
              <div key={fieldID} className={`${classes.Option} ${fieldType === 'Date' ? classes.DateField : ''} ${isActive ? classes.ActiveOption : ''}`}>
                <span className={classes.FieldIcon}>{fieldIcons[fieldType]}</span>
                {isActive ?
                  <input ref={inputRef} className={classes.TitleInput} value={titleInput} autoFocus onChange={e => setTitleInput(e.target.value)} />
                  :
                  <span className={classes.Title}>{fieldTitle}</span>
                }
                <div className={classes.Btns}>
                  <div ref={editBtnRef} className={`${classes.EditBtn} ${isActive ? classes.SaveBtn : ''}`} onClick={() => editHandler(isActive, fieldID, fieldTitle)}>
                    {isActive ? checkIcon : editIcon}
                  </div>
                  <div className={classes.DeleteBtn} onClick={() => props.deleteField(fieldID)}>{xIcon}</div>
                </div>
              </div>
            );
          })}
          <div className={`${classes.Option} ${classes.AddBtn}`} onClick={() => setShowAddField(true)}>{plusIcon}New Field</div>
        </>
      }
    </ModalContainer>
  );
};

CustomFieldModal.propTypes = {
  close: PropTypes.func.isRequired,
  customFields: PropTypes.array.isRequired,
  deleteField: PropTypes.func.isRequired,
  updateTitle: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  customFields: state.lists.currentCard.customFields
});

const mapDispatchToProps = dispatch => ({
  updateTitle: (fieldID, title) => dispatch(updateCustomFieldTitle(fieldID, title)),
  deleteField: fieldID => dispatch(deleteCustomField(fieldID))
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomFieldModal);
