import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classes from './CreateBoard.module.css';
import { useModalToggle } from '../../../utils/customHooks';
import Button, { CloseBtn } from '../../UI/Buttons/Buttons';
import { checkIcon, dotsIcon, teamIcon, personIcon, chevronIcon } from '../../UI/icons';
import { connect } from 'react-redux';
import { createBoard, createTeamBoard, changeCreateBoardTeam } from '../../../store/actions';
import { COLORS, PHOTO_IDS, getPhotoURL } from '../../../utils/backgrounds';
import BackgroundModal from './BackgroundModal/BackgroundModal';

const CreateBoard = props => {
  const [boardTitle, setBoardTitle] = useState('');
  const [boardBackground, setBoardBackground] = useState(COLORS[0]);
  const [options, setOptions] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showTeamSelect, setShowTeamSelect] = useState(false);
  const modalRef = useRef();
  const selectRef = useRef();
  useModalToggle(props.show && !showMore, modalRef, props.close);
  useModalToggle(showTeamSelect, selectRef, () => setShowTeamSelect(false));

  useEffect(() => {
    if (props.show) {
      setBoardTitle('');
      setOptions(COLORS.slice(0, 4).concat(PHOTO_IDS.slice(0, 4)));
      setBoardBackground(COLORS[0]);
    }
  }, [props.show]);

  const submitHandler = () => {
    if (!boardTitle || boardTitle.length > 100) { return; }
    props.close();
    props.teamID ? props.createTeamBoard(boardTitle, boardBackground, props.teamID) :
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

  const showTeamSelectHandler = () => {
    if (!props.teams.allIDs.length) { return; }
    setShowTeamSelect(true);
  };

  const selectTeamHandler = teamID => {
    props.changeCreateBoardTeam(teamID);
    setShowTeamSelect(false);
  };

  return (
    <div className={props.show ? classes.ShowModal : classes.HideModal} ref={modalRef}>
      <div className={classes.ModalContainer}>
        <div className={classes.ModalLeft}
        style={boardBackground[0] === '#' ? { background: boardBackground } : { backgroundImage: getPhotoURL(boardBackground, 250) }}>
          <input className={classes.Input} value={boardTitle}
          onChange={e => setBoardTitle(e.target.value)} placeholder="Board title" />
          <CloseBtn className={classes.CloseBtn} close={props.close} color="white" />
          <div className={classes.BoardTeam} onClick={showTeamSelectHandler}>
            <div className={classes.TeamIcon}>{props.teamID ? teamIcon : personIcon}</div>
            <div className={classes.TeamTitle}>{props.teamID ? props.teams.byID[props.teamID].title : 'Personal'}</div>
            {props.teams.allIDs.length ? <div className={classes.Chevron}>{chevronIcon}</div> : null}
          </div>
          {showTeamSelect &&
            <div className={`StyledScrollbar ${classes.TeamSelect}`} ref={selectRef}>
              {props.teams.allIDs.map(teamID => (
                <div className={classes.SelectOption} key={teamID} onClick={() => selectTeamHandler(teamID)}>
                  <div>{props.teams.byID[teamID].title}</div>
                  {props.teamID === teamID && checkIcon}
                </div>
              ))}
              <div className={classes.SelectOption} onClick={() => selectTeamHandler(null)}>
                <div>Personal (no team)</div>
                {!props.teamID && checkIcon}
              </div>
            </div>
          }
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
      <div className={classes.ConfirmBtn}><Button disabled={!boardTitle} clicked={submitHandler}>Create board</Button></div>
      {showMore && <BackgroundModal close={() => setShowMore(false)} selected={boardBackground} change={backgroundChangeHandler} />}
    </div>
  );
};

CreateBoard.propTypes = {
  show: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  createBoard: PropTypes.func.isRequired,
  teamID: PropTypes.string,
  teamTitle: PropTypes.string,
  createTeamBoard: PropTypes.func.isRequired,
  teams: PropTypes.object.isRequired,
  changeCreateBoardTeam: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  teamID: state.board.createBoardTeamID,
  teams: state.user.teams
});

const mapDispatchToProps = dispatch => ({
  createBoard: (title, color) => dispatch(createBoard(title, color)),
  createTeamBoard: (title, color, teamID) => dispatch(createTeamBoard(title, color, teamID)),
  changeCreateBoardTeam: teamID => dispatch(changeCreateBoardTeam(teamID))
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateBoard);
