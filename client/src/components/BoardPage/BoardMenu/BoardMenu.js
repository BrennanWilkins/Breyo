import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classes from './BoardMenu.module.css';
import { CloseBtn, BackBtn } from '../../UI/Buttons/Buttons';
import Archive from './Archive/Archive';
import AboutMenu from './AboutMenu/AboutMenu';
import SettingsMenu from './SettingsMenu/SettingsMenu';
import BackgroundMenu from './BackgroundMenu/BackgroundMenu';
import ActivityMenu from './ActivityMenu/ActivityMenu';
import SearchCardsMenu from './SearchCardsMenu/SearchCardsMenu';
import MainMenu from './MainMenu/MainMenu';

const BoardMenu = props => {
  const [viewMode, setViewMode] = useState('');

  const resetState = () => {
    setViewMode('');
    if (props.showSearch) { props.setShowSearch(false); }
  };

  useEffect(() => {
    if (props.show) { resetState(); }
  }, [props.show]);

  const title = viewMode === 'about' ? 'About this board' : viewMode === 'background' ? 'Change Background' :
  viewMode === 'activity' ? 'Activity' : viewMode === 'settings' ? 'Board Settings' : viewMode === 'archive' ? 'Archive' : props.showSearch ? 'Search Cards' : 'Menu';

  const content = viewMode === 'about' ? <AboutMenu /> : viewMode === 'background' ? <BackgroundMenu /> : props.showSearch ? <SearchCardsMenu /> :
  viewMode === 'settings' ? <SettingsMenu /> : viewMode === 'archive' ? <Archive /> : viewMode === 'activity' ? <ActivityMenu /> :
  <MainMenu showSearch={() => props.setShowSearch(true)} setViewMode={mode => setViewMode(mode)} />;

  return (
    <div className={props.show ? classes.Menu : `${classes.Menu} ${classes.HideMenu}`}>
      <div className={classes.Title}>
        <span className={(viewMode || props.showSearch) ? classes.ShowBackBtn : classes.HideBackBtn}><BackBtn back={resetState} /></span>
        {title}
        <CloseBtn className={classes.CloseBtn} close={props.close} />
      </div>
      <div className={title === 'Menu' ? null : classes.Content}>{content}</div>
    </div>
  );
};

BoardMenu.propTypes = {
  show: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  showSearch: PropTypes.bool.isRequired,
  setShowSearch: PropTypes.func.isRequired
};

export default BoardMenu;
