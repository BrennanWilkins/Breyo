import React from 'react';
import classes from './BoardNavBar.module.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import QueryCountBtn from '../../UI/QueryCountBtn/QueryCountBtn';
import { dotsIcon, roadmapIcon, boardIcon } from '../../UI/icons';
import { openRoadmap, closeRoadmap } from '../../../store/actions';
import Button from '../../UI/Buttons/Buttons';

const BoardNavBarMenuBtns = props => {
  const roadmapHandler = () => {
    if (props.roadmapShown) { props.closeRoadmap(); }
    else { props.openRoadmap(); }
  };

  const openSearchHandler = () => {
    props.openMenu();
    setTimeout(() => props.openSearch(), 250);
  };

  return (
    <span className={classes.MenuBtns}>
      {props.cardsAreFiltered && <QueryCountBtn openMenu={openSearchHandler} />}
      <Button className={`${classes.Btn} ${classes.RoadBtn} ${props.roadmapShown ? classes.RoadBtn2 : ''}`} clicked={roadmapHandler}>
        {props.roadmapShown ? boardIcon : roadmapIcon}{props.roadmapShown ? 'Board' : 'Roadmaps'}
      </Button>
      {!props.showMenu && <Button className={`${classes.Btn} ${classes.MenuBtn}`} clicked={props.openMenu}>{dotsIcon}Menu</Button>}
    </span>
  );
};

BoardNavBarMenuBtns.propTypes = {
  cardsAreFiltered: PropTypes.bool.isRequired,
  roadmapShown: PropTypes.bool.isRequired,
  openRoadmap: PropTypes.func.isRequired,
  closeRoadmap: PropTypes.func.isRequired,
  showMenu: PropTypes.bool.isRequired,
  openMenu: PropTypes.func.isRequired,
  openSearch: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  cardsAreFiltered: state.lists.cardsAreFiltered,
  roadmapShown: state.board.roadmapShown
});

const mapDispatchToProps = dispatch => ({
  openRoadmap: () => dispatch(openRoadmap()),
  closeRoadmap: () => dispatch(closeRoadmap())
});

export default connect(mapStateToProps, mapDispatchToProps)(BoardNavBarMenuBtns);
