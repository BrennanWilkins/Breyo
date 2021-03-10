import React, { useState, useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import classes from './LabelModal.module.css';
import { useModalToggle } from '../../../../utils/customHooks';
import { LABEL_COLORS } from '../../../../utils/backgrounds';
import { checkIcon, editIcon } from '../../../UI/icons';
import { connect } from 'react-redux';
import { addCardLabel, removeCardLabel, createCustomLabel, addCardCustomLabel,
  deleteCardCustomLabel, updateCustomLabel, deleteCustomLabel } from '../../../../store/actions';
import ModalTitle from '../../../UI/ModalTitle/ModalTitle';
import { ActionBtn, BackBtn } from '../../../UI/Buttons/Buttons';
import { Input } from '../../../UI/Inputs/Inputs';

const LabelModal = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);
  const [labelMode, setLabelMode] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [selectedColor, setSelectedColor] = useState(LABEL_COLORS[0]);
  const [shownEditLabelID, setShownEditLabelID] = useState('');
  const [maxHeight, setMaxHeight] = useState('400px');

  const backHandler = () => {
    setLabelMode('');
    setTitleInput('');
    setSelectedColor(LABEL_COLORS[0]);
    setShownEditLabelID('');
  };

  const toggleLabelHandler = color => {
    if (props.labels.includes(color)) {
      props.removeCardLabel(color);
    } else {
      props.addCardLabel(color);
    }
  };

  const createLabelHandler = () => {
    props.createCustomLabel(selectedColor, titleInput);
    backHandler();
  };

  const toggleCustomLabelHandler = labelID => {
    if (props.cardCustomLabels.includes(labelID)) {
      props.deleteCardCustomLabel(labelID);
    } else {
      props.addCardCustomLabel(labelID);
    }
  };

  const showEditLabelHandler = labelID => {
    setShownEditLabelID(labelID);
    setTitleInput(props.customLabelsByID[labelID].title);
    setSelectedColor(props.customLabelsByID[labelID].color);
    setLabelMode('edit');
  };

  const editCustomLabelHandler = () => {
    backHandler();
    const prevLabel = props.customLabelsByID[shownEditLabelID];
    // dont update if not changed
    if (prevLabel.title === titleInput && prevLabel.color === selectedColor) { return; }
    props.updateCustomLabel(shownEditLabelID, titleInput, selectedColor);
  };

  const deleteCustomLabelHandler = () => {
    props.deleteCustomLabel(shownEditLabelID);
    backHandler();
  };

  useLayoutEffect(() => {
    const rect = modalRef.current.getBoundingClientRect();
    if (rect.bottom > window.innerHeight) {
      setMaxHeight(window.innerHeight - rect.top - 120 + 'px');
    }
    if (!props.openFromMiddle) { return; }
    if (rect.right + 5 >= window.innerWidth) {
      modalRef.current.style.right = '0';
    } else {
      modalRef.current.style.left = '-1px';
    }
  }, [props.openFromMiddle]);

  const createLabel = (
    <>
      <label className={classes.InputLabel}>
        Name
        <Input autoFocus value={titleInput} className={classes.TitleInput} onChange={e => setTitleInput(e.target.value)} />
      </label>
      <div className={classes.InputLabel}>Select a color</div>
      <div className={classes.SelectColors}>
        {LABEL_COLORS.map(color => (
          <div key={color} style={{ background: color }} className={classes.SelectColor} onClick={() => setSelectedColor(color)}>
            <span>{selectedColor === color && checkIcon}</span>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div ref={modalRef} className={props.openFromMiddle ? classes.MiddleContainer : classes.Container}>
      <ModalTitle close={props.close} title={labelMode === 'create' ? 'Create Label' : labelMode === 'edit' ? 'Change Label' : 'Labels'} />
      {labelMode && <div className={classes.BackBtn}><BackBtn back={backHandler} /></div>}
      {
        labelMode === 'create' ?
        <>
          {createLabel}
          <ActionBtn disabled={!titleInput || titleInput.length > 100} clicked={createLabelHandler} className={classes.CreateBtn}>Create</ActionBtn>
        </>
        : labelMode === 'edit' ?
        <>
          {createLabel}
          <div className={classes.EditBtns}>
            <ActionBtn disabled={!titleInput || titleInput.length > 100} clicked={editCustomLabelHandler} className={classes.EditBtn}>Save</ActionBtn>
            <ActionBtn clicked={deleteCustomLabelHandler} className={classes.DeleteBtn}>Delete</ActionBtn>
          </div>
        </>
        :
        <>
          <div className={classes.Colors} style={{ maxHeight }}>
            {props.customLabels.map(labelID => {
              const label = props.customLabelsByID[labelID];
              return (
                <div key={labelID} style={{ background: label.color }} className={classes.Color}>
                  <span onClick={() => toggleCustomLabelHandler(labelID)}>
                    <div className={classes.LabelTitle}>{label.title}</div>{props.cardCustomLabels.includes(labelID) && checkIcon}
                  </span>
                  <div className={classes.ShowEditBtn} onClick={() => showEditLabelHandler(labelID)}>{editIcon}</div>
                </div>
              );
            })}
            {LABEL_COLORS.map(color => (
              <div key={color} style={{ background: color }} className={classes.Color} onClick={() => toggleLabelHandler(color)}>
                <span>{props.labels.includes(color) && checkIcon}</span>
              </div>
            ))}
          </div>
          <ActionBtn className={classes.ShowCreateBtn} clicked={() => setLabelMode('create')}>Create a new label</ActionBtn>
        </>
      }
    </div>
  );
};

LabelModal.propTypes = {
  close: PropTypes.func.isRequired,
  labels: PropTypes.array.isRequired,
  cardCustomLabels: PropTypes.array.isRequired,
  addCardLabel: PropTypes.func.isRequired,
  removeCardLabel: PropTypes.func.isRequired,
  openFromMiddle: PropTypes.bool,
  createCustomLabel: PropTypes.func.isRequired,
  customLabels: PropTypes.array.isRequired,
  customLabelsByID: PropTypes.object.isRequired,
  addCardCustomLabel: PropTypes.func.isRequired,
  deleteCardCustomLabel: PropTypes.func.isRequired,
  deleteCustomLabel: PropTypes.func.isRequired,
  updateCustomLabel: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  labels: state.lists.currentCard.labels,
  cardCustomLabels: state.lists.currentCard.customLabels,
  customLabels: state.board.customLabels.allIDs,
  customLabelsByID: state.board.customLabels.byID
});

const mapDispatchToProps = dispatch => ({
  addCardLabel: color => dispatch(addCardLabel(color)),
  removeCardLabel: color => dispatch(removeCardLabel(color)),
  createCustomLabel: (color, title) => dispatch(createCustomLabel(color, title)),
  addCardCustomLabel: labelID => dispatch(addCardCustomLabel(labelID)),
  deleteCardCustomLabel: labelID => dispatch(deleteCardCustomLabel(labelID)),
  deleteCustomLabel: labelID => dispatch(deleteCustomLabel(labelID)),
  updateCustomLabel: (labelID, title, color) => dispatch(updateCustomLabel(labelID, color, title))
});

export default connect(mapStateToProps, mapDispatchToProps)(LabelModal);
