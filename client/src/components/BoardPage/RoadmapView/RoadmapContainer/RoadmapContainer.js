import React, { useState, useEffect, useCallback } from 'react';
import classes from './RoadmapContainer.module.css';
import PropTypes from 'prop-types';
import RoadmapNavBar from '../RoadmapNavBar/RoadmapNavBar';
import DateBars from '../DateBars/DateBars';
import LaneTypes from '../LaneTypes/LaneTypes';
import RoadmapLanes from '../RoadmapLanes/RoadmapLanes';
import { connect } from 'react-redux';
import { setRoadmapDateRange, setRoadmapMode } from '../../../../store/actions';
import { startOfMonth, endOfMonth, startOfYear, endOfYear, startOfWeek, endOfWeek,
  isThisWeek, isThisMonth, isThisYear, addWeeks, subWeeks, addMonths, subMonths,
  addYears, subYears, getDaysInMonth, differenceInCalendarDays, differenceInCalendarMonths } from 'date-fns';

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
    width = (Math.abs(differenceInCalendarMonths(cardStart, cardDue)) + 1) * dateWidth - 1;
    left = differenceInCalendarMonths(cardStart, startDate) * dateWidth;
  } else {
    width = (Math.abs(differenceInCalendarDays(cardStart, cardDue)) + 1) * dateWidth - 1;
    left = differenceInCalendarDays(cardStart, startDate) * dateWidth;
  }
  return { card, width, left };
};

const getCardsByMember = (lists, boardMembers) => {
  const members = {};
  for (let list of lists) {
    for (let card of list.cards) {
      if (!card.members.length) { continue; }
      for (let member of card.members) {
        if (members[member.email]) {
          members[member.email].push({ ...card, listID: list.listID });
        } else {
          members[member.email] = [{ ...card, listID: list.listID }];
        }
      }
    }
  }
  return boardMembers.map(member => ({ ...member, cards: members[member.email] }));
};

const getCardsByLabel = (lists, customLabels) => {
  const labels = {};
  for (let list of lists) {
    for (let card of list.cards) {
      if (!card.customLabels.length) { continue; }
      for (let labelID of card.customLabels) {
        if (labels[labelID]) {
          labels[labelID].push({ ...card, listID: list.listID })
        } else {
          labels[labelID] = [{ ...card, listID: list.listID }];
        }
      }
    }
  }
  return customLabels.allIDs.map(labelID => {
    const { title, color } = customLabels.byID[labelID];
    return { labelID, cards: labels[labelID] || [], title, color };
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
  const [dateWidth, setDateWidth] = useState(55);
  const [totalWidth, setTotalWidth] = useState(null);
  const [totalHeight, setTotalHeight] = useState('100%');
  const [lanes, setLanes] = useState([]);

  const calcWidthHandler = useCallback(() => {
    let totalWidth = window.innerWidth - 220;
    if (props.menuShown) { totalWidth -= 350; }
    const { type, startDate } = props.dateRange;
    const divisor = type === 'Month' ? getDaysInMonth(startDate) : type === 'Week' ? 7 : 12;
    const dateWidth = Math.max(55, totalWidth / divisor);
    const datesWidth = dateWidth * divisor;
    setDateWidth(dateWidth);
    setTotalWidth(datesWidth);
  }, [props.menuShown, props.dateRange]);

  useEffect(() => {
    calcWidthHandler();

    window.addEventListener('resize', calcWidthHandler);
    return () => window.removeEventListener('resize', calcWidthHandler);
  }, [calcWidthHandler]);

  const changeRangeTypeHandler = type => {
    if (type === props.dateRange.type) { return; }
    props.setDateRange(setRangeHelper(type, props.dateRange.startDate));
  };

  const moveToTodayHandler = () => {
    // check if today's date is already in current date range
    const { startDate, type } = props.dateRange;
    if ((type === 'Week' && isThisWeek(startDate)) ||
        (type === 'Month' && isThisMonth(startDate)) ||
        (type === 'Year' && isThisYear(startDate))) { return; }

    props.setDateRange(setRangeHelper(type, new Date()));
  };

  const subRangeHandler = () => props.setDateRange(moveRangeHelper(props.dateRange, false));

  const addRangeHandler = () => props.setDateRange(moveRangeHelper(props.dateRange, true));

  useEffect(() => {
    let totHeight = 50;
    if (props.roadmapMode === 'List') {
      setLanes(props.lists.map(list => {
        const { cards, height } = getLaneCards(list, props.dateRange, dateWidth, true);
        const unassignedCards = getUnassignedCards(list.cards.map(card => ({ ...card, listID: list.listID })));
        totHeight += height;
        return { title: list.title, id: list.listID, cards, unassignedCards, height: height + 'px' };
      }));
    } else if (props.roadmapMode === 'Member') {
      setLanes(getCardsByMember(props.lists, props.members).map(member => {
        const { cards, height } = getLaneCards(member, props.dateRange, dateWidth);
        const unassignedCards = getUnassignedCards(member.cards);
        totHeight += height;
        return { ...member, id: member.email, cards, unassignedCards, height: height + 'px' };
      }));
    } else {
      setLanes(getCardsByLabel(props.lists, props.customLabels).map(label => {
        const { cards, height } = getLaneCards(label, props.dateRange, dateWidth);
        const unassignedCards = getUnassignedCards(label.cards);
        totHeight += height;
        return { title: label.title, color: label.color, id: label.labelID, cards, unassignedCards, height: height + 'px' };
      }));
    }
    setTotalHeight(totHeight + 'px');
  }, [props.lists, props.members, props.customLabels, props.dateRange, props.roadmapMode, dateWidth]);

  return (
    <div className={classes.Container} style={props.menuShown ? {width: 'calc(100% - 350px)'} : null}>
      <RoadmapNavBar roadmapMode={props.roadmapMode} rangeType={props.dateRange.type} startDate={props.dateRange.startDate}
      changeMode={mode => props.setRoadmapMode(mode)} changeRangeType={changeRangeTypeHandler} moveToToday={moveToTodayHandler}
      subRange={subRangeHandler} addRange={addRangeHandler} />
      <div className={classes.RoadmapContainer}>
        <LaneTypes mode={props.roadmapMode} lanes={lanes} totalHeight={totalHeight} />
        <DateBars rangeType={props.dateRange.type} startDate={props.dateRange.startDate} endDate={props.dateRange.endDate}
        dateWidth={dateWidth} totalHeight={totalHeight} />
        <RoadmapLanes lanes={lanes} totalWidth={totalWidth} dateWidth={dateWidth} />
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
  lists: PropTypes.array.isRequired,
  setDateRange: PropTypes.func.isRequired,
  setRoadmapMode: PropTypes.func.isRequired,
  roadmapMode: PropTypes.string.isRequired,
  dateRange: PropTypes.shape({
    type: PropTypes.string.isRequired,
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date)
  })
};

const mapStateToProps = state => ({
  lists: state.lists.lists,
  members: state.board.members,
  customLabels: state.board.customLabels,
  dateRange: state.roadmap.dateRange,
  roadmapMode: state.roadmap.roadmapMode
});

const mapDispatchToProps = dispatch => ({
  setDateRange: dateRange => dispatch(setRoadmapDateRange(dateRange)),
  setRoadmapMode: mode => dispatch(setRoadmapMode(mode))
});

export default connect(mapStateToProps, mapDispatchToProps)(RoadmapContainer);
