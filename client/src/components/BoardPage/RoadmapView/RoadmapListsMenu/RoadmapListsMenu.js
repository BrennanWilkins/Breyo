import React from 'react';
import classes from './RoadmapListsMenu.module.css';
import MenuToggle from '../../../UI/MenuToggle/MenuToggle';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setShownRoadmapList } from '../../../../store/actions';

const RoadmapListsMenu = props => {
  return (
    <div className={props.show ? classes.Container : classes.Hide}>
      <MenuToggle collapsed={!props.show} toggle={props.toggle} />
      <div className={classes.Title}>Lists</div>
      <div className={classes.Lists}>
        {props.lists.map(list => (
          <div key={list.listID} onClick={() => props.setShownRoadmapList(list.listID)}
          className={list.listID === props.shownRoadmapListID ? classes.ListBtnActive : classes.ListBtn}>{list.title}</div>
        ))}
      </div>
    </div>
  );
};

RoadmapListsMenu.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  lists: PropTypes.array.isRequired,
  setShownRoadmapList: PropTypes.func.isRequired,
  shownRoadmapListID: PropTypes.string
};

const mapDispatchToProps = dispatch => ({
  setShownRoadmapList: listID => dispatch(setShownRoadmapList(listID))
});

export default connect(null, mapDispatchToProps)(RoadmapListsMenu);
