import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classes from './SearchBoardMenu.module.css';
import { useModalToggle } from '../../../utils/customHooks';
import { connect } from 'react-redux';
import { CloseBtn, ExpandBtn } from '../../UI/Buttons/Buttons';
import { starIcon, personIcon, teamIcon } from '../../UI/icons';
import BoardRect from './BoardRect/BoardRect';
import { toggleIsStarred } from '../../../store/actions';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

const SearchBoardMenu = props => {
  let history = useHistory();
  const modalRef = useRef();
  const [query, setQuery] = useState('');
  const [expandStarred, setExpandStarred] = useState(true);
  const [expandPersonal, setExpandPersonal] = useState(false);
  const [searchRes, setSearchRes] = useState([]);
  const [expandedTeams, setExpandedTeams] = useState([]);

  useEffect(() => {
    const search = queryVal => {
      setSearchRes(props.boards.allIDs.filter(boardID => props.boards.byID[boardID].title.toLowerCase().includes(queryVal.toLowerCase())));
    };

    if (query) { search(query); }
  }, [query, props.boards.allIDs, props.boards.byID]);

  useModalToggle(true, modalRef, props.close);

  const navHandler = boardID => {
    history.push(`/board/${boardID}`);
    props.close();
  };

  const expandTeamHandler = teamID => {
    const teams = [...expandedTeams];
    let idx = teams.indexOf(teamID);
    if (idx === -1) { teams.push(teamID); }
    else { teams.splice(idx, 1); }
    setExpandedTeams(teams);
  };

  return (
    <div ref={modalRef} className={classes.Modal}>
      <div className={classes.SearchDiv}>
        <input className={classes.Input} value={query} onChange={e => setQuery(e.target.value)}
        placeholder="Search boards by title" />
        <CloseBtn close={props.close} />
      </div>
      {!query.length ?
      <>
      <div className={classes.Title}><span>{starIcon} STARRED BOARDS</span><ExpandBtn clicked={() => setExpandStarred(prev => !prev)} expanded={expandStarred} /></div>
      {expandStarred && props.boards.allIDs.filter(boardID => props.boards.byID[boardID].isStarred).map(boardID => (
        <BoardRect {...props.boards.byID[boardID]} key={boardID} toggleIsStarred={() => props.toggleIsStarred(boardID)} nav={navHandler} />
      ))}
      <div className={classes.Title}><span>{personIcon} PERSONAL BOARDS</span><ExpandBtn clicked={() => setExpandPersonal(prev => !prev)} expanded={expandPersonal} /></div>
      {expandPersonal && props.boards.allIDs.filter(boardID => !props.teams.byID[props.boards.byID[boardID].teamID]).map(boardID => (
        <BoardRect {...props.boards.byID[boardID]} key={boardID} toggleIsStarred={() => props.toggleIsStarred(boardID)} nav={navHandler} />
      ))}
      {props.teams.allIDs.map(teamID => {
        let expanded = expandedTeams.includes(teamID);
        const team = props.teams.byID[teamID];
        return (
          <React.Fragment key={teamID}>
            <div className={classes.Title}>
              <span>{teamIcon} <div className={classes.TeamTitle} onClick={props.close}><Link to={`/team/${team.url}`}>{team.title}</Link></div></span>
              <ExpandBtn clicked={() => expandTeamHandler(teamID)} expanded={expanded} />
            </div>
            {expanded && props.boards.allIDs.filter(boardID => props.boards.byID[boardID].teamID === teamID).map(boardID => (
              <BoardRect {...props.boards.byID[boardID]} key={boardID} toggleIsStarred={() => props.toggleIsStarred(boardID)} nav={navHandler} />
            ))}
          </React.Fragment>
        );
      })}
      </> :
      searchRes.map(boardID => (
        <BoardRect key={boardID} {...props.boards.byID[boardID]} toggleIsStarred={() => props.toggleIsStarred(boardID)} nav={navHandler} />
      ))}
    </div>
  );
};

SearchBoardMenu.propTypes = {
  close: PropTypes.func.isRequired,
  boards: PropTypes.object.isRequired,
  toggleIsStarred: PropTypes.func.isRequired,
  teams: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  boards: state.user.boards,
  teams: state.user.teams
});

const mapDispatchToProps = dispatch => ({
  toggleIsStarred: boardID => dispatch(toggleIsStarred(boardID))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBoardMenu);
