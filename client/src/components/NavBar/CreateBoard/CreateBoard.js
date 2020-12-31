import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classes from './CreateBoard.module.css';
import { useModalToggle } from '../../../utils/customHooks';
import Button, { CloseBtn } from '../../UI/Buttons/Buttons';
import { checkIcon, dotsIcon, teamIcon, personIcon } from '../../UI/icons';
import { connect } from 'react-redux';
import { createBoard } from '../../../store/actions';
import { COLORS, PHOTO_IDS, getPhotoURL } from '../../../utils/backgrounds';
import BackgroundModal from './BackgroundModal/BackgroundModal';

const CreateBoard = props => {
  const [boardTitle, setBoardTitle] = useState('');
  const [boardBackground, setBoardBackground] = useState(COLORS[0]);
  const [options, setOptions] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const modalRef = useRef();
  useModalToggle(props.show && !showMore, modalRef, props.close);

  useEffect(() => {
    if (props.show) {
      setBoardTitle('');
      setOptions(COLORS.slice(0, 4).concat(PHOTO_IDS.slice(0, 4)));
      setBoardBackground(COLORS[0]);
    }
  }, [props.show]);

  const submitHandler = () => {
    if (boardTitle === '' || boardTitle.length > 100) { return; }
    props.close();
    props.createBoard(boardTitle, boardBackground);
  };

  const backgroundChangeHandler = option => {
    if (options.indexOf(option) === -1) {
      // if default options dont include the selected background then add it
      const newOptions = [...options];
      if (option[0] === '#') { newOptions[0] = option; }
      else { newOptions[4] = option; }
      setOptions(newOptions);
    }
    setBoardBackground(option);
  };

  return (
    <div className={props.show ? classes.ShowModal : classes.HideModal} ref={modalRef}>
      <div className={classes.ModalContainer}>
        <div className={classes.ModalLeft} style={boardBackground[0] === '#' ? { background: boardBackground } :
        { backgroundImage: getPhotoURL(boardBackground, 250) }}>
          <div className={classes.InputDiv}>
            <input className={classes.Input} value={boardTitle}
            onChange={e => setBoardTitle(e.target.value)} placeholder="Board title" />
            <CloseBtn close={props.close} color="white" />
          </div>
          <div className={classes.BoardTeam}>{props.teamID ? teamIcon : personIcon}{props.teamTitle || 'Personal'}</div>
        </div>
        <div className={classes.BackgroundSelect}>
          {options.map(option => (
            <div key={option} className={classes.Option} onClick={() => setBoardBackground(option)}
            style={option[0] === '#' ? { background: option } : { backgroundImage: getPhotoURL(option, 35) }}>
              {boardBackground === option && checkIcon}
              <div className={boardBackground === option ? classes.ShowOverlay : classes.HideOverlay}></div>
            </div>
          ))}
          <div className={`${classes.Option} ${classes.ShowMore}`} title="Show more" onClick={() => setShowMore(true)}>
            {dotsIcon}
            <div className={classes.HideOverlay}></div>
          </div>
        </div>
      </div>
      <div className={classes.ConfirmBtn}><Button disabled={boardTitle === ''} clicked={submitHandler}>Create board</Button></div>
      {showMore && <BackgroundModal close={() => setShowMore(false)} selected={boardBackground} change={backgroundChangeHandler} />}
    </div>
  );
};

CreateBoard.propTypes = {
  show: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  createBoard: PropTypes.func.isRequired,
  teamID: PropTypes.string,
  teamTitle: PropTypes.string
};

const mapStateToProps = state => ({
  teamID: state.board.createBoardTeamID,
  teamTitle: state.board.createBoardTeamTitle
});

const mapDispatchToProps = dispatch => ({
  createBoard: (title, color) => dispatch(createBoard(title, color))
});

export default connect(null, mapDispatchToProps)(CreateBoard);
