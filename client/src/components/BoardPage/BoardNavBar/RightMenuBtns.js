import React, { useState, useRef } from 'react';
import classes from './BoardNavBar.module.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import QueryCountBtn from '../../UI/QueryCountBtn/QueryCountBtn';
import { dotsIcon, roadmapIcon, boardIcon, pieChartIcon, chevronIcon } from '../../UI/icons';
import { openRoadmap, setShownBoardView, resetSearchQuery } from '../../../store/actions';
import Button from '../../UI/Buttons/Buttons';
import { useModalToggle } from '../../../utils/customHooks';

const RightMenuBtns = props => {
  const [showViewModal, setShowViewModal] = useState(false);
  const viewModalRef = useRef();
  useModalToggle(showViewModal, viewModalRef, () => setShowViewModal(false));

  const viewHandler = view => {
    setShowViewModal(false);
    if (view === props.shownView) { return; }
    if (view === 'roadmap') { props.openRoadmap(); }
    else { props.setShownBoardView(view); }
    if (view !== 'lists') { props.resetSearchQuery(); }
  };

  const openSearchHandler = () => {
    props.openMenu();
    setTimeout(() => props.openSearch(), 250);
  };

  return (
    <span className={classes.MenuBtns}>
      {props.cardsAreFiltered && <QueryCountBtn openMenu={openSearchHandler} />}
      <span className={classes.Container}>
        <Button className={`${classes.Btn} ${classes.ViewBtn}`} clicked={() => setShowViewModal(true)}>
          {props.shownView === 'lists' ? boardIcon : props.shownView === 'roadmap' ? roadmapIcon : pieChartIcon}
          {props.shownView === 'lists' ? 'Board' : props.shownView === 'roadmap' ? 'Roadmaps' : 'Overview'}
          <div className={classes.ChevronIcon}>{chevronIcon}</div>
        </Button>
        {showViewModal &&
          <div ref={viewModalRef} className={classes.ViewModal}>
            <div className={classes.ViewOption} onClick={() => viewHandler('lists')}>
              <div className={classes.ViewTitle}>{boardIcon} Board</div>
              <div className={classes.ViewInfo}>View the board's lists and cards in the default view.</div>
            </div>
            <div className={classes.ViewOption} onClick={() => viewHandler('roadmap')}>
              <div className={classes.ViewTitle}>{roadmapIcon} Roadmaps</div>
              <div className={classes.ViewInfo}>View cards in a list in a Gantt chart style view.</div>
            </div>
            <div className={classes.ViewOption} onClick={() => viewHandler('overview')}>
              <div className={classes.ViewTitle}>{pieChartIcon} Overview</div>
              <div className={classes.ViewInfo}>View metrics and statistics on this board.</div>
            </div>
          </div>
        }
      </span>
      {!props.menuShown && <Button className={`${classes.Btn} ${classes.MenuBtn}`} clicked={props.openMenu}>{dotsIcon}Menu</Button>}
    </span>
  );
};

RightMenuBtns.propTypes = {
  cardsAreFiltered: PropTypes.bool.isRequired,
  openRoadmap: PropTypes.func.isRequired,
  menuShown: PropTypes.bool.isRequired,
  openMenu: PropTypes.func.isRequired,
  openSearch: PropTypes.func.isRequired,
  shownView: PropTypes.string.isRequired,
  setShownBoardView: PropTypes.func.isRequired,
  resetSearchQuery: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  cardsAreFiltered: state.lists.cardsAreFiltered,
  shownView: state.board.shownView
});

const mapDispatchToProps = dispatch => ({
  openRoadmap: () => dispatch(openRoadmap()),
  setShownBoardView: view => dispatch(setShownBoardView(view)),
  resetSearchQuery: () => dispatch(resetSearchQuery())
});

export default connect(mapStateToProps, mapDispatchToProps)(RightMenuBtns);
