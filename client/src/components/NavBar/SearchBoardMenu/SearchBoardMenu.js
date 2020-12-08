import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classes from './SearchBoardMenu.module.css';
import { useModalToggle } from '../../../utils/customHooks';
import { connect } from 'react-redux';
import { CloseBtn, ExpandBtn } from '../../UI/Buttons/Buttons';
import { starIcon, personIcon } from '../../UI/icons';
import BoardRect from './BoardRect/BoardRect';
import { toggleIsStarred } from '../../../store/actions';

const SearchBoardMenu = props => {
  const modalRef = useRef();
  const [query, setQuery] = useState('');
  const [expandStarred, setExpandStarred] = useState(true);
  const [expandPersonal, setExpandPersonal] = useState(false);
  const [searchRes, setSearchRes] = useState([]);

  useEffect(() => {
    if (props.show) {
      setQuery('');
      setExpandStarred(true);
      setExpandPersonal(false);
      setSearchRes([]);
    }
  }, [props.show]);

  useEffect(() => {
    const search = queryVal => {
      setSearchRes(props.boards.filter(board => board.title.toLowerCase().includes(queryVal.toLowerCase())));
    };

    if (query !== '') { search(query); }
  }, [query, props.boards]);

  useModalToggle(props.show, modalRef, props.close);

  return (
    <div ref={modalRef} className={props.show ? classes.ShowModal : classes.HideModal}>
      <div className={classes.SearchDiv}>
        <input className={classes.Input} value={query} onChange={e => setQuery(e.target.value)}
        placeholder="Search boards by title" />
        <CloseBtn close={props.close} />
      </div>
      {query.length === 0 ?
      <>
      <div className={classes.Title}><span>{starIcon} STARRED BOARDS</span><ExpandBtn clicked={() => setExpandStarred(prev => !prev)} expanded={expandStarred} /></div>
      {expandStarred && props.boards.filter(board => board.isStarred).map(board => (
        <BoardRect {...board} key={board.boardID} toggleIsStarred={() => props.toggleIsStarred(board.boardID)} close={props.close} />
      ))}
      <div className={classes.Title}><span>{personIcon} PERSONAL BOARDS</span><ExpandBtn clicked={() => setExpandPersonal(prev => !prev)} expanded={expandPersonal} /></div>
      {expandPersonal && props.boards.map(board => (
        <BoardRect {...board} key={board.boardID} toggleIsStarred={() => props.toggleIsStarred(board.boardID)} close={props.close} />
      ))}
      </> :
      searchRes.map(board => (
        <BoardRect key={board.boardID} {...board} toggleIsStarred={() => props.toggleIsStarred(board.boardID)} close={props.close} />
      ))}
    </div>
  );
};

SearchBoardMenu.propTypes = {
  show: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  boards: PropTypes.array.isRequired,
  toggleIsStarred: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  boards: state.auth.boards
});

const mapDispatchToProps = dispatch => ({
  toggleIsStarred: boardID => dispatch(toggleIsStarred(boardID))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBoardMenu);
