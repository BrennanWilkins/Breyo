import React, { useState, useLayoutEffect, useRef } from 'react';
import classes from './Roadmap.module.css';
import PropTypes from 'prop-types';
import { differenceInCalendarDays, max, min, eachMonthOfInterval, format, startOfMonth } from 'date-fns';

const Roadmap = props => {
  const [defaultDayWidth, setDefaultDayWidth] = useState(10);
  const [cards, setCards] = useState([]);
  const [monthRange, setMonthRange] = useState([]);
  const containerRef = useRef();

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

    const updatedCards = props.cards.map((card, i) => {
      let startDate = card.dueDate.startDate ? new Date(card.dueDate.startDate) : null;
      let dueDate = new Date(card.dueDate.dueDate);
      const width = calcCardWidth(startDate, dueDate);
      const margin = calcCardMargin(startDate ? startDate : dueDate, minDate);
      const markerTop = -i * 55 - 10;
      const markerHeight = containerRef.current.getBoundingClientRect().height - 45;
      // if calculated card width <= 30px then show card title outside card
      return (
        <div className={classes.CardContainer} key={card.cardID} style={{ width: `${width}px`, marginLeft: `${margin}px` }}>
          <div onClick={() => props.showDetails(card.cardID)} className={classes.CardInnerContainer}>
            <div className={card.dueDate.isComplete ? classes.CardComplete : classes.Card}></div>
            <div style={width <= 30 ? {left: `${width + 5}px`} : { width: `${width - 5}px` }}
            className={`${classes.CardTitle} ${width >= 30 ? classes.CardTitleInner : ''}`}>{card.title}</div>
          </div>
          {startDate && <div className={classes.DateMarker} style={{ marginLeft: '-10px', top: `${markerTop}px`, height: `${markerHeight}px` }}><div></div></div>}
          <div className={classes.DateMarker} style={{ marginLeft: `${width - 11}px`, top: `${markerTop}px`, height: `${markerHeight}px` }}><div></div></div>
        </div>
      );
    });
    setCards(updatedCards);

    // returns formatted array of all months from minDate to maxDate
    const months = eachMonthOfInterval({ start: minDate, end: maxDate }).map(month => format(new Date(month), 'MMM yyyy'));
    setMonthRange(months);
  }, [props.cards]);

  return (
    <div className={classes.OuterContainer} style={(props.cardsShown && props.listsShown) ? { width: 'calc(100% - 500px)', left: '250px' } :
    props.cardsShown ? { width: 'calc(100% - 250px)' } : props.listsShown ? { width: 'calc(100% - 250px)', left: '250px' } : null}>
      <div className={classes.InnerContainer} ref={containerRef}>
        <div className={classes.DatesContainer}>
          {monthRange.map((month, i) => <div key={i} style={{ minWidth: `${defaultDayWidth * 30}px` }} className={classes.Month}>{month}</div>)}
        </div>
        <div className={classes.CardsContainer}>{cards}</div>
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
