import React, { useState, useRef, useLayoutEffect } from 'react';
import classes from './LaneTypes.module.css';
import PropTypes from 'prop-types';
import { AccountBtn } from '../../../UI/Buttons/Buttons';
import { plusIcon } from '../../../UI/icons';
import UnassignedModal from '../UnassignedModal/UnassignedModal';

const LaneTypes = props => {
  const [shownModalTitle, setShownModalTitle] = useState('');
  const [shownCards, setShownCards] = useState([]);
  const [modalStyle, setModalStyle] = useState({ top: '0', left: '0' });
  const containerRef = useRef();

  useLayoutEffect(() => {
    const rect = containerRef.current.getBoundingClientRect();
    setModalStyle({ top: rect.top + 10 + 'px', left: rect.right + 10 + 'px' });
  }, [shownModalTitle]);

  const showModalHandler = (title, cards) => {
    setShownModalTitle(title);
    setShownCards(cards);
  };

  return (
    <div className={classes.Container} style={{ minHeight: props.totalHeight }} ref={containerRef}>
      {
        props.mode === 'List' ?
          props.lanes.map(({ id, height, title, unassignedCards }, i) => (
            <div key={id} style={{ height }} className={classes.Lane}>
              <div className={classes.Title}>
                <div className={classes.TitleText}>{title}</div>
              </div>
              {unassignedCards.length > 0 && <div className={classes.UnassignedBtn} onClick={() => showModalHandler(title, unassignedCards)}>
                ({unassignedCards.length}) Not Scheduled{plusIcon}
              </div>}
            </div>
          ))
        : props.mode === 'Member' ?
          props.lanes.map(({ id, height, fullName, avatar, unassignedCards }) => (
            <div key={id} style={{ height }} className={classes.Lane}>
              <div className={classes.Title}>
                <AccountBtn className={classes.Avatar} avatar={avatar}>{fullName ? fullName[0] : ''}</AccountBtn>
                <div className={classes.TitleText}>{fullName}</div>
              </div>
              {unassignedCards.length > 0 && <div className={classes.UnassignedBtn} onClick={() => showModalHandler(fullName, unassignedCards)}>
                ({unassignedCards.length}) Not Scheduled{plusIcon}
              </div>}
            </div>
          ))
        :
          props.lanes.map(({ id, height, color, title, unassignedCards }) => (
            <div key={id} style={{ height }} className={classes.Lane}>
              <div className={classes.Title}>
                <div className={classes.Label} style={{ background: color || null }} />
                <div className={classes.TitleText}>{title}</div>
              </div>
              {unassignedCards.length > 0 && <div className={classes.UnassignedBtn} onClick={() => showModalHandler(title, unassignedCards)}>
                ({unassignedCards.length}) Not Scheduled{plusIcon}
              </div>}
            </div>
          ))
      }
      {shownModalTitle.length > 0 && <UnassignedModal style={modalStyle} close={() => setShownModalTitle('')} title={shownModalTitle} cards={shownCards} />}
    </div>
  );
};

LaneTypes.propTypes = {
  mode: PropTypes.string.isRequired,
  lanes: PropTypes.array.isRequired,
  totalHeight: PropTypes.string.isRequired
};

export default LaneTypes;
