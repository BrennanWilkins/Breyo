import React from 'react';
import classes from './BackgroundModal.module.css';
import PropTypes from 'prop-types';
import { COLORS, PHOTO_IDS, getPhotoURL } from '../../../../utils/backgrounds';
import { checkIcon } from '../../../UI/icons';
import ModalContainer from '../../../UI/ModalContainer/ModalContainer';

const BackgroundModal = props => (
  <ModalContainer className={classes.Container} close={props.close} title="Board Background">
    <div className={`StyledScrollbar ${classes.Options}`}>
      <div className={classes.ColorTitle}>Colors</div>
      <div className={classes.OptionSelect}>
        {COLORS.map(color => (
          <div key={color} className={classes.Option} onClick={() => props.change(color)} style={{ background: color }}>
            {props.selected === color && checkIcon}
            <div className={props.selected === color ? classes.ShowOverlay : classes.HideOverlay}></div>
          </div>
        ))}
      </div>
      <div className={classes.PhotoTitle}>Photos</div>
      <div className={classes.OptionSelect}>
        {PHOTO_IDS.map(photoID => (
          <div key={photoID} className={classes.Option} onClick={() => props.change(photoID)}
          style={{ backgroundImage: getPhotoURL(photoID, 100) }}>
            {props.selected === photoID && checkIcon}
            <div className={props.selected === photoID ? classes.ShowOverlay : classes.HideOverlay}></div>
          </div>
        ))}
      </div>
    </div>
  </ModalContainer>
);

BackgroundModal.propTypes = {
  close: PropTypes.func.isRequired,
  selected: PropTypes.string.isRequired,
  change: PropTypes.func.isRequired
};

export default BackgroundModal;
