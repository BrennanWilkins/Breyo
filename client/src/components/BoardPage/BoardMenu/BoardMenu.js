import React, { useRef } from 'react';
import classes from './BoardMenu.module.css';
import { CloseBtn } from '../../UI/Buttons/Buttons';
import { useModalToggle } from '../../../utils/customHooks';

const BoardMenu = props => {
  const menuRef = useRef();
  useModalToggle(props.show, menuRef, props.close);

  return (
    <div ref={menuRef} className={props.show ? classes.ShowModal : classes.HideModal}>
      <div className={classes.Title}>
        Menu
        <CloseBtn close={props.close} />
      </div>
    </div>
  );
};

export default BoardMenu;
