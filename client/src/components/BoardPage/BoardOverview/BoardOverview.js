import React, { useState, useEffect } from 'react';
import classes from './BoardOverview.module.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isThisWeek, isPast } from 'date-fns';
import OverviewCard from './OverviewCard';
import { BarChart, PieChart } from '../../UI/Charts/Charts';

const getDueDateTypes = lists => {
  const data = [
    { title: 'No due date', cards: 0, fill: '#707070' },
    { title: 'Complete', cards: 0, fill: '#60C44D'  },
    { title: 'Due Later', cards: 0, fill: '#F5DD2A'  },
    { title: 'Due soon', cards: 0, fill: '#FF8C00' },
    { title: 'Overdue', cards: 0, fill: '#F60000' }
  ];
  let noCardsCount = 0;
  lists.forEach(list => {
    if (!list.cards.length) { return noCardsCount++; }
    list.cards.forEach(card => {
      if (!card.dueDate) { data[0].cards++; }
      else if (card.dueDate.isComplete) { data[1].cards++; }
      else if (isPast(new Date(card.dueDate.dueDate))) { data[2].cards++; }
      else if (isThisWeek(new Date(card.dueDate.dueDate))) { data[3].cards++; }
      else { data[4].cards++; }
    });
  });
  if (noCardsCount === lists.length) { return []; }
  return data;
};

const getCardsByMember = lists => {
  const members = {};
  lists.forEach(list => list.cards.forEach(card => card.members.forEach(member => {
    if (!members[member.email]) { members[member.email] = { fullName: member.fullName, cards: 1 }; }
    else { members[member.email].cards++; }
  })));
  const data = [];
  for (let member in members) { data.push({ name: members[member].fullName, cards: members[member].cards }); }
  return data;
};

const labelsByTitle = {
  '#60C44D': 'green',
  '#F5DD2A': 'yellow',
  '#FF8C00': 'orange',
  '#F60000': 'red',
  '#3783FF': 'blue',
  '#4815AA': 'purple'
};

const getCardsByLabel = lists => {
  const labels = {};
  lists.forEach(list => list.cards.forEach(card => card.labels.forEach(label => {
    labels[label] = !labels[label] ? 1 : labels[label] + 1;
  })));
  const data = [];
  for (let label in labels) { data.push({ title: labelsByTitle[label], fill: label, cards: labels[label] }); }
  return data;
};

const BoardOverview = props => {
  const [cardsPerList, setCardsPerList] = useState([]);
  const [cardsByDueDate, setCardsByDueDate] = useState([]);
  const [cardsByMember, setCardsByMember] = useState([]);
  const [cardsByLabel, setCardsByLabel] = useState([]);
  const [modes, setModes] = useState({
    list: 'bar',
    members: 'bar',
    dates: 'pie',
    labels: 'pie'
  });

  useEffect(() => {
    setCardsPerList(props.lists.map(list => ({ title: list.title, cards: list.cards.length })));
    setCardsByDueDate(getDueDateTypes(props.lists));
    setCardsByMember(getCardsByMember(props.lists));
    setCardsByLabel(getCardsByLabel(props.lists));
  }, []);

  const changeModeHandler = (mode, chartType) => {
    if (mode === modes[chartType]) { return; }
    setModes({ ...modes, [chartType]: mode });
  };

  return (
    <div className={`${classes.Container} ${props.menuShown ? classes.ContainerSmall : ''}`}>
      <OverviewCard title="Cards per list" changeMode={mode => changeModeHandler(mode, 'list')}>
        {
          !cardsPerList.length ? <p className={classes.NoData}>There are no lists in this board.</p> :
          modes.list === 'bar' ? <BarChart data={cardsPerList} xKey="title" yKey="cards" /> :
          <PieChart data={cardsPerList} xKey="title" yKey="cards" randomFill />
        }
      </OverviewCard>
      <OverviewCard title="Cards per member" changeMode={mode => changeModeHandler(mode, 'members')}>
        {
          !cardsByMember.length ? <p className={classes.NoData}>There are no members assigned to cards in this board.</p> :
          modes.members === 'bar' ? <BarChart data={cardsByMember} xKey="name" yKey="cards" /> :
          <PieChart data={cardsByMember} xKey="name" yKey="cards" randomFill />
        }
      </OverviewCard>
      <OverviewCard title="Cards per due date" changeMode={mode => changeModeHandler(mode, 'dates')}>
        {
          !cardsByDueDate.length ? <p className={classes.NoData}>There are no cards in this board.</p> :
          modes.dates === 'bar' ? <BarChart data={cardsByDueDate} xKey="title" yKey="cards" /> :
          <PieChart data={cardsByDueDate} xKey="title" yKey="cards" />
        }
      </OverviewCard>
      <OverviewCard title="Cards per label" changeMode={mode => changeModeHandler(mode, 'labels')}>
        {
          !cardsByLabel.length ? <p className={classes.NoData}>There are no cards with labels in this board.</p> :
          modes.labels === 'bar' ? <BarChart data={cardsByLabel} xKey="title" yKey="cards" /> :
          <PieChart data={cardsByLabel} xKey="title" yKey="cards" />
        }
      </OverviewCard>
    </div>
  );
};

BoardOverview.propTypes = {
  menuShown: PropTypes.bool.isRequired,
  lists: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  lists: state.lists.lists
});

export default connect(mapStateToProps)(BoardOverview);
