import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classes from './CreateBoard.module.css';
import { useModalToggle } from '../../../utils/customHooks';
import Button, { CloseBtn } from '../../UI/Buttons/Buttons';
import { checkIcon } from '../../UI/icons';

const COLORS = ['rgb(240, 144, 0)', 'rgb(72, 154, 60)', 'rgb(113, 80, 223)',
                'rgb(0,121,191)', 'rgb(176, 32, 32)', 'rgb(56, 187, 244)',
                'rgb(173, 80, 147)', 'rgb(74, 50, 221)', 'rgb(4, 107, 139)'];

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
  close: PropTypes.func.isRequired
};

export default CreateBoard;
