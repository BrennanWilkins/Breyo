import React, { useState } from 'react';
import classes from './SearchCardsMenu.module.css';
import { LABEL_COLORS } from '../../../../utils/backgrounds';
import { checkIcon } from '../../../UI/icons';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { AccountBtn } from '../../../UI/Buttons/Buttons';
import { addTitleSearchQuery, addLabelSearchQuery, addDueDateSearchQuery,
  addMemberSearchQuery, resetSearchQuery } from '../../../../store/actions';
import { useDidUpdate } from '../../../../utils/customHooks';

const SearchCardsMenu = props => {
  const { titleQuery, memberQuery, labels, dueDateQuery } = props.searchQueries;
  const [titleInput, setTitleInput] = useState('');

  useDidUpdate(() => {
    if (titleInput !== titleQuery && !titleQuery) { setTitleInput(''); }
  }, [titleQuery]);

  useDidUpdate(() => {
    props.addTitleSearchQuery(titleInput);
  }, [titleInput]);

  const memberHandler = email => {
    if (email === memberQuery) { props.addMemberSearchQuery(''); }
    else { props.addMemberSearchQuery(email); }
  };

  const dueDateFilterHandler = mode => {
    if (dueDateQuery === mode) { props.addDueDateSearchQuery(''); }
    else { props.addDueDateSearchQuery(mode); }
  };

  return (
    <>
    <div className={classes.Input}>
      <label className={classes.Label}>
        Search by card title
        <input value={titleInput} className={classes.Input} onChange={e => setTitleInput(e.target.value)} />
      </label>
    </div>
    <div onClick={props.resetSearchQuery} className={classes.ClearSearch}>Clear Search</div>
    <div className={classes.Label}>Filter by card label</div>
    <div className={classes.CardLabels}>
      {LABEL_COLORS.map(color => (
        <div key={color} className={classes.CardLabel} style={{ background: color }} onClick={() => props.addLabelSearchQuery(color)}>
          {labels.includes(color) && checkIcon}
        </div>
      ))}
    </div>
    <div className={classes.Label}>Filter by due date</div>
    <div className={classes.DateFilters}>
      <div onClick={() => dueDateFilterHandler('day')}>Due in the next day {dueDateQuery === 'day' && checkIcon}</div>
      <div onClick={() => dueDateFilterHandler('week')}>Due this week {dueDateQuery === 'week' && checkIcon}</div>
      <div onClick={() => dueDateFilterHandler('month')}>Due this month {dueDateQuery === 'month' && checkIcon}</div>
      <div onClick={() => dueDateFilterHandler('overdue')}>Overdue {dueDateQuery === 'overdue' && checkIcon}</div>
      <div onClick={() => dueDateFilterHandler('complete')}>Due date marked as complete {dueDateQuery === 'complete' && checkIcon}</div>
      <div onClick={() => dueDateFilterHandler('incomplete')}>Due date marked as incomplete {dueDateQuery === 'incomplete' && checkIcon}</div>
    </div>
    <div className={classes.Label}>Filter by card member</div>
    <div className={classes.BoardMembers}>
      {props.members.map(member => (
        <div className={classes.Member} key={member.email} onClick={() => memberHandler(member.email)}>
          <AccountBtn avatar={member.avatar}>{member.fullName[0]}</AccountBtn>
          {member.fullName}
          {memberQuery === member.email && checkIcon}
        </div>
      ))}
    </div>
    </>
  );
};

SearchCardsMenu.propTypes = {
  members: PropTypes.array.isRequired,
  addTitleSearchQuery: PropTypes.func.isRequired,
  addLabelSearchQuery: PropTypes.func.isRequired,
  addMemberSearchQuery: PropTypes.func.isRequired,
  addDueDateSearchQuery: PropTypes.func.isRequired,
  searchQueries: PropTypes.object.isRequired,
  resetSearchQuery: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  members: state.board.members,
  searchQueries: state.lists.searchQueries
});

const mapDispatchToProps = dispatch => ({
  addTitleSearchQuery: query => dispatch(addTitleSearchQuery(query)),
  addLabelSearchQuery: query => dispatch(addLabelSearchQuery(query)),
  addMemberSearchQuery: query => dispatch(addMemberSearchQuery(query)),
  addDueDateSearchQuery: query => dispatch(addDueDateSearchQuery(query)),
  resetSearchQuery: () => dispatch(resetSearchQuery())
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchCardsMenu);
