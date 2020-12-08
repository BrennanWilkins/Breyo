import React, { useState, useLayoutEffect } from 'react';
import classes from './Roadmap.module.css';
import PropTypes from 'prop-types';
import { differenceInCalendarDays, max, min, eachMonthOfInterval, format, startOfMonth } from 'date-fns';
import { zoomInIcon, zoomOutIcon, checkIcon } from '../../../UI/icons';

const Roadmap = props => {
  const [defaultDayWidth, setDefaultDayWidth] = useState(10);
  const [cards, setCards] = useState([]);
  const [monthRange, setMonthRange] = useState([]);
  const [markerDates, setMarkerDates] = useState([]);

  const calcCardWidth = (start, end) => {
    // by default card w no start date is 10px
    if (!start) { return 10; }
    const days = differenceInCalendarDays(end, start);
    // width of card calculated by day range & default day width
    return days * defaultDayWidth;
  };

  const calcCardMargin = (start, minDate) => {
    const days = differenceInCalendarDays(start, minDate);
    // card left margin set based on minDate to startDate * default day width
    return days * defaultDayWidth;
  };

  useLayoutEffect(() => {
    if (!props.cards.length && cards.length) {
      setCards([]);
      setMarkerDates([]);
      return setMonthRange([]);
    }
    if (!props.cards.length) { return; }
    const dates = [];
    for (let card of props.cards) {
      if (card.dueDate.startDate) { dates.push(new Date(card.dueDate.startDate)); }
      dates.push(new Date(card.dueDate.dueDate));
    }
    // get min date from all dates & get the start of that month
    const minDate = startOfMonth(min(dates));
    // get max date from all dates
    const maxDate = max(dates);
    const updatedMarkerDates = [];

    const updatedCards = props.cards.map((card, i) => {
      let startDate = card.dueDate.startDate ? new Date(card.dueDate.startDate) : null;
      let dueDate = new Date(card.dueDate.dueDate);
      const width = calcCardWidth(startDate, dueDate);
      const margin = calcCardMargin(startDate ? startDate : dueDate, minDate);
      if (startDate) { updatedMarkerDates.push({ date: startDate, left: margin, isStart: true }); }
      updatedMarkerDates.push({ date: dueDate, left: margin + width, isStart: false });
      // if calculated card width <= 50px then show card title outside card
      return (
        <div className={classes.CardContainer} key={card.cardID} style={{ width: `${width}px`, marginLeft: `${margin}px` }}>
          <div onClick={() => props.showDetails(card.cardID)} className={classes.CardInnerContainer}>
            <div className={classes.Card}>
              {card.roadmapLabel && <span style={{ background: card.roadmapLabel, border: `2px solid ${card.roadmapLabel}` }}></span>}
            </div>
            <div style={width <= 50 ? {left: `${width + 5}px`} : { width: `${width - 5}px` }}
            className={`${classes.CardTitle} ${width >= 50 ? classes.CardTitleInner : ''}`}>{card.dueDate.isComplete && checkIcon}{card.title}</div>
          </div>
        </div>
      );
    });
    setCards(updatedCards);
    setMarkerDates(updatedMarkerDates);

    // returns formatted array of all months from minDate to maxDate
    const months = eachMonthOfInterval({ start: minDate, end: maxDate }).map(month => format(new Date(month), 'MMM yyyy'));
    setMonthRange(months);
  }, [props.cards, defaultDayWidth]);

  return (
    <div className={classes.OuterContainer} style={(props.cardsShown && props.listsShown) ? { width: 'calc(100% - 500px)', left: '250px' } :
    props.cardsShown ? { width: 'calc(100% - 250px)' } : props.listsShown ? { width: 'calc(100% - 250px)', left: '250px' } : null}>
      <div className={classes.ZoomBtns}>
        <div onClick={() => setDefaultDayWidth(prev => prev + 1)}>{zoomInIcon}</div>
        <div onClick={() => defaultDayWidth > 1 && setDefaultDayWidth(prev => prev - 1)}>{zoomOutIcon}</div>
      </div>
      <div className={classes.InnerContainer}>
        <div className={classes.DatesContainer}>
          {monthRange.map((month, i) => (
            <div key={i} style={{ minWidth: `${defaultDayWidth * 30}px` }} className={classes.Month}>{month}</div>
          ))}
        </div>
        <div className={classes.CardsContainer}>{cards}</div>
        {!props.cards.length && <div className={classes.NoCards}>There aren't any cards added to this list's roadmap yet.
        To add a card, add a start date or due date to the card.</div>}
        {monthRange.map((month, i) => (
          <div key={i} style={{ marginLeft: `${defaultDayWidth * 30 * i - 1.2}px`, width: `${defaultDayWidth * 30}px` }} className={classes.MonthSeparator}></div>
        ))}
        {markerDates.map(({ date, left, isStart }, i) => (
          <div key={i} className={classes.DateMarker} style={{ left: `${isStart ? left - 12 : left - 10}px` }}>
            <div className={classes.DateTooltip}>{format(date, `MMM d 'at' h:mm aa`)}</div>
            <div className={classes.MarkerBar}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

Roadmap.propTypes = {
  cardsShown: PropTypes.bool.isRequired,
  listsShown: PropTypes.bool.isRequired,
  cards: PropTypes.array.isRequired,
  showDetails: PropTypes.func.isRequired
};

export default Roadmap;
