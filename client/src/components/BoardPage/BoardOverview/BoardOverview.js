import React, { useState, useEffect } from 'react';
import classes from './BoardOverview.module.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, PieChart, Pie, Legend, Cell } from 'recharts';
import { isThisWeek, isPast } from 'date-fns';
import OverviewCard from './OverviewCard';

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

  useEffect(() => {
    setCardsPerList(props.lists.map(list => ({ title: list.title, cards: list.cards.length })));
    setCardsByDueDate(getDueDateTypes(props.lists));
    setCardsByMember(getCardsByMember(props.lists));
    setCardsByLabel(getCardsByLabel(props.lists));
  }, []);

  const changeModeHandler = mode => {

  };

  return (
    <div className={`${classes.Container} ${props.menuShown ? classes.ContainerSmall : ''}`}>
      <OverviewCard title="Cards per list" mode="bar" changeMode={changeModeHandler}>
        {!cardsPerList.length ? <p className={classes.NoData}>There are no lists in this board.</p> :
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cardsPerList}>
              <YAxis />
              <XAxis dataKey="title" />
              <Tooltip />
              <Bar dataKey="cards" fill="#555555" />
            </BarChart>
          </ResponsiveContainer>
        }
      </OverviewCard>
      <OverviewCard title="Cards per member" mode="bar" changeMode={changeModeHandler}>
        {!cardsByMember.length ? <p className={classes.NoData}>There are no members assigned to cards in this board.</p> :
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cardsByMember}>
              <YAxis />
              <XAxis dataKey="name" />
              <Tooltip />
              <Bar dataKey="cards" fill="#555555" />
            </BarChart>
          </ResponsiveContainer>
        }
      </OverviewCard>
      <OverviewCard title="Cards per due date" mode="pie" changeMode={changeModeHandler}>
        {!cardsByDueDate.length ? <p className={classes.NoData}>There are no cards in this board.</p> :
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={cardsByDueDate} dataKey="cards" nameKey="title">
                {cardsByDueDate.map(date => <Cell key={date.title} fill={date.fill} />)}
              </Pie>
              <Tooltip />
              <Legend align="right" layout="vertical" verticalAlign="middle" />
            </PieChart>
          </ResponsiveContainer>
        }
      </OverviewCard>
      <OverviewCard title="Cards per label" mode="pie" changeMode={changeModeHandler}>
        {!cardsByLabel.length ? <p className={classes.NoData}>There are no cards with labels in this board.</p> :
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={cardsByLabel} dataKey="cards" nameKey="title">
                {cardsByLabel.map(label => <Cell key={label.fill} fill={label.fill} />)}
              </Pie>
              <Tooltip />
              <Legend align="right" layout="vertical" verticalAlign="middle" />
            </PieChart>
          </ResponsiveContainer>
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
