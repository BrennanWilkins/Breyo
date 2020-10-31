import React, { useState } from 'react';
import classes from './AddList.module.css';
import { plusIcon } from '../../../UI/icons';

const AddList = props => {
  const [showInput, setShowInput] = useState(false);

  return (
    <div>
      <div className={classes.AddBtn}>{plusIcon}{props.listCount === 0 ? 'Add a list' : 'Add another list'}</div>
    </div>
  );
};

export default AddList;
