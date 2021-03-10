import React, { useState, useEffect, useCallback } from 'react';
import classes from './RoadmapContainer.module.css';
import PropTypes from 'prop-types';
import RoadmapNavBar from '../RoadmapNavBar/RoadmapNavBar';
import DateBars from '../DateBars/DateBars';
import LaneTypes from '../LaneTypes/LaneTypes';
import RoadmapLanes from '../RoadmapLanes/RoadmapLanes';
import { connect } from 'react-redux';
import { startOfMonth, endOfMonth, startOfYear, endOfYear, startOfWeek, endOfWeek,
  isThisWeek, isThisMonth, isThisYear, addWeeks, subWeeks, addMonths, subMonths,
  addYears, subYears, getDaysInMonth, differenceInDays, differenceInCalendarMonths } from 'date-fns';

const calcRows = cards => {
  cards.sort((a,b) => a.left - b.left);
  const rows = [...Array(cards.length)].map(_ => []);
  for (let card of cards) {
    for (let i = 0; i < rows.length; i++) {
      // if card does not overlap w another card on the row then add to row else check next row
      const overlappingCard = rows[i].length ? rows[i].find(rowCard => rowCard.left + rowCard.width > card.left) : false;
      if (!overlappingCard) { rows[i].push(card); break; }
    }
  }
  const finalCards = [];
  for (let i = 0; i < rows.length; i++) {
    finalCards.push(...rows[i].map(card => ({ ...card, top: i * 50 })));
  }
  return finalCards;
};

const calcWidthLeft = (card, startDate, dateWidth, rangeType) => {
  let cardStart = new Date(card.dueDate.startDate);
  let cardDue = new Date(card.dueDate.dueDate);
  let width, left;
  if (rangeType === 'Year') {
    width = (Math.abs(differenceInCalendarMonths(cardStart, cardDue)) + 1) * dateWidth - 3;
    left = differenceInCalendarMonths(cardStart, startDate) * dateWidth + 1;
  } else {
    width = (Math.abs(differenceInDays(cardStart, cardDue)) + 2) * dateWidth - 3;
    left = differenceInDays(cardStart, startDate) * dateWidth + 1;
  }
  return { card, width, left };
};

const getCardsByMember = (lists, boardMembers) => {
  const members = {};
  for (let member of boardMembers) { members[member.email] = []; }
  for (let list of lists) {
    for (let card of list.cards) {
      if (card.members.length) {
        for (let member of card.members) {
          members[member.email].push({ ...card, listID: list.listID });
        }
      }
    }
  }
  return boardMembers.map(member => ({ ...member, cards: members[member.email] }));
};

const getCardsByLabel = (lists, customLabels) => {
  const labels = {};
  for (let labelID of customLabels.allIDs) { labels[labelID] = []; }
  for (let list of lists) {
    for (let card of list.cards) {
      if (card.customLabels.length) {
        for (let labelID of card.customLabels) {
          labels[labelID].push({ ...card, listID: list.listID });
        }
      }
    }
  }
  return customLabels.allIDs.map(labelID => {
    const { title, color } = customLabels.byID[labelID];
    return { labelID, cards: labels[labelID], title, color };
  });
};

const getLaneCards = (field, dateRange, dateWidth, isList) => {
  const cards = calcRows(field.cards.filter(card => {
    if (!card.dueDate || !card.dueDate.dueDate || !card.dueDate.startDate) { return false; }
    // only show cards that overlap in start to end date interval
    if (new Date(card.dueDate.startDate) > dateRange.endDate || new Date(card.dueDate.dueDate) < dateRange.startDate) { return false; }
    return true;
  }).map(card => (
    calcWidthLeft(isList ? { ...card, listID: field.listID } : card, dateRange.startDate, dateWidth, dateRange.type)
  )));
  // roadmap lane height min 100px
  const height = cards.length ? Math.max(cards[cards.length - 1].top + 70, 100) : 100;
  return { cards, height };
};

const getUnassignedCards = cards => cards.filter(card => !card.dueDate || !card.dueDate.startDate || !card.dueDate.dueDate);

const moveRangeHelper = (dateRange, isAdding) => {
  switch (dateRange.type) {
    case 'Week': {
      let startDate = isAdding ? addWeeks(dateRange.startDate, 1) : subWeeks(dateRange.startDate, 1);
      return { type: 'Week', startDate, endDate: endOfWeek(startDate) };
    }
    case 'Month': {
      let startDate = isAdding ? addMonths(dateRange.startDate, 1) : subMonths(dateRange.startDate, 1);
      return { type: 'Month', startDate, endDate: endOfMonth(startDate) };
    }
    case 'Year': {
      let startDate = isAdding ? addYears(dateRange.startDate, 1) : subYears(dateRange.startDate, 1);
      return { type: 'Year', startDate, endDate: endOfYear(startDate) };
    }
    default: return;
  }
};

const setRangeHelper = (type, date) => {
  switch (type) {
    case 'Week': return {
      type: 'Week',
      startDate: startOfWeek(date),
      endDate: endOfWeek(date)
    };
    case 'Month': return {
      type: 'Month',
      startDate: startOfMonth(date),
      endDate: endOfMonth(date)
    };
    case 'Year': return {
      type: 'Year',
      startDate: startOfYear(date),
      endDate: endOfYear(date)
    };
    default: return;
  }
};

const RoadmapContainer = props => {
  const [roadmapMode, setRoadmapMode] = useState('List');
  const [dateRange, setDateRange] = useState({
    type: 'Month',
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date())
  });
  const [dateWidth, setDateWidth] = useState(55);
  const [totalWidth, setTotalWidth] = useState(null);
  const [totalHeight, setTotalHeight] = useState('100%');
  const [lanes, setLanes] = useState([]);

  const calcWidthHandler = useCallback(() => {
    let totalWidth = window.innerWidth - 220;
    if (props.menuShown) { totalWidth -= 350; }
    let dateWidth, datesWidth;
    if (dateRange.type === 'Month') {
      let days = getDaysInMonth(dateRange.startDate);
      dateWidth = Math.max(55, totalWidth / days);
      datesWidth = dateWidth * days;
    } else if (dateRange.type === 'Week') {
      dateWidth = Math.max(55, totalWidth / 7);
      datesWidth = dateWidth * 7;
    } else {
      dateWidth = Math.max(55, totalWidth / 12);
      datesWidth = dateWidth * 12;
    }
    setDateWidth(dateWidth);
    setTotalWidth(datesWidth);
  }, [props.menuShown, dateRange]);

  useEffect(() => {
    calcWidthHandler();

    window.addEventListener('resize', calcWidthHandler);
    return () => window.removeEventListener('resize', calcWidthHandler);
  }, [calcWidthHandler]);

  const changeRangeTypeHandler = type => {
    if (type === dateRange.type) { return; }
    setDateRange(setRangeHelper(type, dateRange.startDate));
  };

  const moveToTodayHandler = () => {
    // check if today's date is already in current date range
    let start = dateRange.startDate;
    if ((dateRange.type === 'Week' && isThisWeek(start)) ||
        (dateRange.type === 'Month' && isThisMonth(start)) ||
        (dateRange.type === 'Year' && isThisYear(start))) { return; }

    setDateRange(setRangeHelper(dateRange.type, new Date()));
  };

  const subRangeHandler = () => setDateRange(moveRangeHelper(dateRange, false));

  const addRangeHandler = () => setDateRange(moveRangeHelper(dateRange, true));

  useEffect(() => {
    if (roadmapMode === 'List') {
      let totHeight = 50;
      setLanes(props.lists.map(list => {
        const { cards, height } = getLaneCards(list, dateRange, dateWidth, true);
        const unassignedCards = getUnassignedCards(list.cards.map(card => ({ ...card, listID: list.listID })));
        totHeight += height;
        return { title: list.title, id: list.listID, cards, unassignedCards, height: height + 'px' };
      }));
      setTotalHeight(totHeight + 'px');
    } else if (roadmapMode === 'Member') {
      let totHeight = 50;
      setLanes(getCardsByMember(props.lists, props.members).map(member => {
        const { cards, height } = getLaneCards(member, dateRange, dateWidth);
        const unassignedCards = getUnassignedCards(member.cards);
        totHeight += height;
        return { ...member, id: member.email, cards, unassignedCards, height: height + 'px' };
      }));
      setTotalHeight(totHeight + 'px');
    } else {
      let totHeight = 50;
      setLanes(getCardsByLabel(props.lists, props.customLabels).map(label => {
        const { cards, height } = getLaneCards(label, dateRange, dateWidth);
        const unassignedCards = getUnassignedCards(label.cards);
        totHeight += height;
        return { title: label.title, color: label.color, id: label.labelID, cards, unassignedCards, height: height + 'px' };
      }));
      setTotalHeight(totHeight + 'px');
    }
  }, [props.lists, props.members, props.customLabels, dateRange, roadmapMode, dateWidth]);

  return (
    <div className={classes.Container} style={props.menuShown ? {width: 'calc(100% - 350px)'} : null}>
      <RoadmapNavBar roadmapMode={roadmapMode} rangeType={dateRange.type} startDate={dateRange.startDate}
      changeMode={mode => setRoadmapMode(mode)} changeRangeType={changeRangeTypeHandler} moveToToday={moveToTodayHandler}
      subRange={subRangeHandler} addRange={addRangeHandler} />
      <div className={classes.RoadmapContainer}>
        <LaneTypes mode={roadmapMode} lanes={lanes} totalHeight={totalHeight} />
        <DateBars rangeType={dateRange.type} startDate={dateRange.startDate} endDate={dateRange.endDate} dateWidth={dateWidth} totalHeight={totalHeight} />
        <RoadmapLanes lanes={lanes} totalWidth={totalWidth} />
      </div>
    </div>
  );
};

RoadmapContainer.propTypes = {
  menuShown: PropTypes.bool.isRequired,
  members: PropTypes.array.isRequired,
  customLabels: PropTypes.shape({
    byID: PropTypes.object.isRequired,
    allIDs: PropTypes.array.isRequired
  }),
  lists: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  lists: state.lists.lists,
  members: state.board.members,
  customLabels: state.board.customLabels
});

export default connect(mapStateToProps)(RoadmapContainer);
