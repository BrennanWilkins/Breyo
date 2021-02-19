import React, { useState, useEffect, useRef } from 'react';
import classes from './ListActions.module.css';
import PropTypes from 'prop-types';
import TextArea from 'react-textarea-autosize';

const CopyList = props => {
  const inputRef = useRef();
  const [copyListTitle, setCopyListTitle] = useState(props.title);

  const copyHandler = e => {
    e.preventDefault();
    if (!copyListTitle || copyListTitle.length > 200) { return; }
    props.copyList(copyListTitle);
    props.close();
  };

  useEffect(() => inputRef.current.select(), []);

  return (
    <div className={classes.ViewContainer}>
      <form className={classes.CopyForm} onSubmit={copyHandler}>
        <TextArea className={classes.Input} value={copyListTitle} onChange={e => setCopyListTitle(e.target.value)}
        placeholder="Enter list title" ref={inputRef} minRows="2" maxRows="4" />
        <button type="submit" disabled={!copyListTitle} className={classes.SubmitBtn}>Create List</button>
      </form>
    </div>
  );
};

CopyList.propTypes = {
  close: PropTypes.func.isRequired,
  copyList: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

export default CopyList;
