import React from 'react';
import classes from './BackgroundMenu.module.css';
import { checkIcon } from '../../../UI/icons';
import { connect } from 'react-redux';
import { updateColor } from '../../../../store/actions';
import { COLORS, PHOTO_IDS, getPhotoURL } from '../../../../utils/backgrounds';
import PropTypes from 'prop-types';

const BackgroundMenu = props => (
  <div className={classes.Options}>
    {COLORS.map(color => (
      <div key={color} onClick={() => props.updateColor(color)} style={{background: color}}>
        {color === props.color && checkIcon}<span></span>
      </div>
    ))}
    {PHOTO_IDS.map(photoID => (
      <div key={photoID} onClick={() => props.updateColor(photoID)} style={{backgroundImage: getPhotoURL(photoID, 155) }}>
        {photoID === props.color && checkIcon}<span></span>
      </div>
    ))}
  </div>
);

BackgroundMenu.propTypes = {
  color: PropTypes.string.isRequired,
  updateColor: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  color: state.board.color
});

const mapDispatchToProps = dispatch => ({
  updateColor: color => dispatch(updateColor(color))
});

export default connect(mapStateToProps, mapDispatchToProps)(BackgroundMenu);
