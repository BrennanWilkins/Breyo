import React, { useState } from 'react';
import classes from './SearchCardsMenu.module.css';
import { LABEL_COLORS } from '../../../../utils/backgrounds';
import { checkIcon } from '../../../UI/icons';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { AccountBtn } from '../../../UI/Buttons/Buttons';
import { addTitleSearchQuery, addLabelSearchQuery, addDueDateSearchQuery, addMemberSearchQuery,
  resetSearchQuery, setShownBoardView, addCustomLabelSearchQuery } from '../../../../store/actions';
import { useDidUpdate } from '../../../../utils/customHooks';

const SearchCardsMenu = props => {
  const { titleQuery, memberQuery, labels, dueDateQuery, customLabels } = props.searchQueries;
  const [titleInput, setTitleInput] = useState('');

  useDidUpdate(() => {
    if (titleInput !== titleQuery && !titleQuery) { setTitleInput(''); }
  }, [titleQuery]);

  const resetCheck = () => {
    if (props.shownView !== 'lists') { props.resetView(); }
  };

  useDidUpdate(() => {
    props.addTitleSearchQuery(titleInput);
    // if not on board view then navigate to it
  }, [titleInput]);

  const memberHandler = email => {
    if (email === memberQuery) { props.addMemberSearchQuery(''); }
    else { props.addMemberSearchQuery(email); }
    resetCheck();
  };

  const dueDateFilterHandler = mode => {
    if (dueDateQuery === mode) { props.addDueDateSearchQuery(''); }
    else { props.addDueDateSearchQuery(mode); }
    resetCheck();
  };

  const labelFilterHandler = color => {
    props.addLabelSearchQuery(color);
    resetCheck();
  };

  const customLabelFilterHandler = labelID => {
    props.addCustomLabelSearchQuery(labelID);
    resetCheck();
  };

  return (
    <>
    <label className={classes.Label}>
      Search by card title
      <input value={titleInput} className={classes.Input} onChange={e => setTitleInput(e.target.value)} />
    </label>
    <div onClick={props.resetSearchQuery} className={classes.ClearSearch}>Clear Search</div>
    <div className={classes.Label}>Filter by card label</div>
    <div className={`${classes.Section} ${classes.CardLabels}`}>
      {LABEL_COLORS.map(color => (
        <div key={color} className={classes.CardLabel} style={{ background: color }} onClick={() => labelFilterHandler(color)}>
          <span>{labels.includes(color) && checkIcon}</span>
        </div>
      ))}
    </div>
    <div className={classes.Label}>Filter by custom card label</div>
    <div className={`${classes.Section} ${classes.CustomCardLabels}`}>
      {props.customLabels.map(labelID => {
        const label = props.customLabelsByID[labelID];
        if (!label) { return null; }
        return (
          <div key={labelID} className={classes.CustomLabel} onClick={() => customLabelFilterHandler(labelID)}>
            <div className={classes.CustomLabelColor} style={{ background: label.color }} />
            <div className={classes.CustomLabelTitle}>{label.title}</div>
            {customLabels.includes(labelID) && checkIcon}
          </div>
        );
      })}
    </div>
    <div className={classes.Label}>Filter by due date</div>
    <div className={`${classes.Section} ${classes.DateFilters}`}>
      <div onClick={() => dueDateFilterHandler('day')}>Due in the next day {dueDateQuery === 'day' && checkIcon}</div>
      <div onClick={() => dueDateFilterHandler('week')}>Due this week {dueDateQuery === 'week' && checkIcon}</div>
      <div onClick={() => dueDateFilterHandler('month')}>Due this month {dueDateQuery === 'month' && checkIcon}</div>
      <div onClick={() => dueDateFilterHandler('overdue')}>Overdue {dueDateQuery === 'overdue' && checkIcon}</div>
      <div onClick={() => dueDateFilterHandler('complete')}>Due date marked as complete {dueDateQuery === 'complete' && checkIcon}</div>
      <div onClick={() => dueDateFilterHandler('incomplete')}>Due date marked as incomplete {dueDateQuery === 'incomplete' && checkIcon}</div>
    </div>
    <div className={classes.Label}>Filter by card member</div>
    <div>
      {props.members.map(member => (
        <div className={classes.Member} key={member.email} onClick={() => memberHandler(member.email)}>
          <AccountBtn avatar={member.avatar}>{member.fullName[0]}</AccountBtn>
          <div className={classes.MemberName}>{member.fullName}</div>
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
  addCustomLabelSearchQuery: PropTypes.func.isRequired,
  addMemberSearchQuery: PropTypes.func.isRequired,
  addDueDateSearchQuery: PropTypes.func.isRequired,
  searchQueries: PropTypes.object.isRequired,
  resetSearchQuery: PropTypes.func.isRequired,
  resetView: PropTypes.func.isRequired,
  shownView: PropTypes.string.isRequired,
  customLabels: PropTypes.array.isRequired,
  customLabelsByID: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  members: state.board.members,
  searchQueries: state.lists.searchQueries,
  shownView: state.board.shownView,
  customLabels: state.board.customLabels.allIDs,
  customLabelsByID: state.board.customLabels.byID
});

const mapDispatchToProps = dispatch => ({
  addTitleSearchQuery: query => dispatch(addTitleSearchQuery(query)),
  addLabelSearchQuery: query => dispatch(addLabelSearchQuery(query)),
  addCustomLabelSearchQuery: query => dispatch(addCustomLabelSearchQuery(query)),
  addMemberSearchQuery: query => dispatch(addMemberSearchQuery(query)),
  addDueDateSearchQuery: query => dispatch(addDueDateSearchQuery(query)),
  resetSearchQuery: () => dispatch(resetSearchQuery()),
  resetView: () => dispatch(setShownBoardView('lists')),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchCardsMenu);
