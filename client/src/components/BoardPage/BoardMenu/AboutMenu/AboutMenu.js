import React, { useState, useMemo } from 'react';
import classes from './AboutMenu.module.css';
import PropTypes from 'prop-types';
import parseToJSX from '../../../../utils/parseToJSX';
import TextArea from 'react-textarea-autosize';
import AccountInfo from '../../../UI/AccountInfo/AccountInfo';
import { connect } from 'react-redux';
import { updateBoardDesc } from '../../../../store/actions';
import Button, { CloseBtn, ActionBtn } from '../../../UI/Buttons/Buttons';
import { personIcon, descIcon } from '../../../UI/icons';
import FormattingModal from '../../FormattingModal/FormattingModal';

const AboutMenu = props => {
  const [showEditDesc, setShowEditDesc] = useState(false);
  const [descInput, setDescInput] = useState(props.desc);
  const [showFormattingHelp, setShowFormattingHelp] = useState(false);

  const formattedDesc = useMemo(() => parseToJSX(props.desc), [props.desc]);

  const saveDescHandler = () => {
    if (descInput.length > 600) {
      setShowEditDesc(false);
      return setDescInput(props.desc);
    }
    props.updateDesc(descInput);
    setShowEditDesc(false);
  };

  return (
    <>
      <div className={classes.Title}>{personIcon}Created by</div>
      <AccountInfo fullName={props.creator.fullName} email={props.creator.email} avatar={props.creator.avatar} givePadding noBorder />
      <div className={classes.Title}>{descIcon}Description
        {!showEditDesc && props.desc.length > 0 &&
          <span className={classes.EditBtn}><ActionBtn clicked={() => setShowEditDesc(true)}>Edit</ActionBtn></span>}
      </div>
      {showEditDesc ? <>
        <TextArea className={classes.DescInput} minRows="3" maxRows="50" value={descInput} onChange={e => setDescInput(e.target.value)} autoFocus />
        <div className={classes.Btns}>
          <span className={classes.SaveBtn}><Button clicked={saveDescHandler} disabled={descInput === props.desc}>Save</Button></span>
          <span className={classes.CloseBtn}><CloseBtn close={() => { setShowEditDesc(false); setDescInput(props.desc); }} /></span>
          <span className={classes.FormatBtn}><ActionBtn clicked={() => setShowFormattingHelp(true)}>Formatting help</ActionBtn></span>
        </div>
      </> : props.desc.length === 0 ?
        <div className={classes.NoDesc} onClick={() => setShowEditDesc(true)}>
          Add a description to let others know what this board is used for and what they can expect.
        </div>
      : <div className={classes.DescText}>{formattedDesc}</div>}
      {showFormattingHelp && <FormattingModal close={() => setShowFormattingHelp(false)} />}
    </>
  );
};

AboutMenu.propTypes = {
  creator: PropTypes.object.isRequired,
  desc: PropTypes.string.isRequired,
  updateDesc: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  creator: state.board.creator,
  desc: state.board.desc
});

const mapDispatchToProps = dispatch => ({
  updateDesc: desc => dispatch(updateBoardDesc(desc))
});

export default connect(mapStateToProps, mapDispatchToProps)(AboutMenu);
