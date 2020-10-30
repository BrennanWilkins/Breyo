import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classes from './CreateBoard.module.css';
import { useModalToggle } from '../../../utils/customHooks';
import Button, { CloseBtn } from '../../UI/Buttons/Buttons';
import { checkIcon } from '../../UI/icons';
import { connect } from 'react-redux';
import { createBoard } from '../../../store/actions';
import COLORS from '../../../utils/colors';

const CreateBoard = props => {
  const [boardTitle, setBoardTitle] = useState('');
  const [boardColor, setBoardColor] = useState(COLORS[4]);
  const modalRef = useRef();

  const closeHandler = () => {
    props.close();
    setTimeout(() => {
      setBoardTitle('');
      setBoardColor(COLORS[4]);
    }, 300);
  };

  useModalToggle(props.show, modalRef, closeHandler);

  const submitHandler = () => {
    if (boardTitle === '' || boardTitle.length > 50) { return; }
    closeHandler();
    props.createBoard(boardTitle, boardColor);
  };

  return (
    <div className={props.show ? classes.ShowModal : classes.HideModal} ref={modalRef}>
      <div className={classes.ModalContainer}>
        <div className={classes.ModalLeft} style={{ background: boardColor }}>
          <div className={classes.InputDiv}>
            <input className={classes.Input} value={boardTitle}
            onChange={e => setBoardTitle(e.target.value)} placeholder="Board title" />
            <CloseBtn close={closeHandler} color="white" />
          </div>
        </div>
        <div className={classes.ColorSelect}>
          {COLORS.map((color, i) => (
            <div key={i} className={classes.Color} onClick={() => setBoardColor(color)} style={{ background: color }}>
              {boardColor === color && checkIcon}
            </div>
          ))}
        </div>
      </div>
      <div className={classes.Btn}><Button disabled={boardTitle === ''} clicked={submitHandler}>Create board</Button></div>
    </div>
  );
};

CreateBoard.propTypes = {
  show: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  createBoard: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  createBoard: (title, color) => dispatch(createBoard(title, color))
});

export default connect(null, mapDispatchToProps)(CreateBoard);
