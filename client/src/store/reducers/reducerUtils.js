import { isToday, isTomorrow, isThisWeek, isThisMonth, isPast } from 'date-fns';

// checks if an action can be done if all board activity shown, it is not currently loading, & no errors
export const checkBoardActivity = state => state.allBoardActivityShown && !state.allBoardActivityLoading && !state.allBoardActivityErr;

// updates listID for activities in array
export const updateActivityListID = (arr, oldListID, newListID) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].listID === oldListID) {
      const updatedEntry = { ...arr[i], listID: newListID };
      arr[i] = updatedEntry;
    }
  }
  return arr;
};

// finds index in state array where a given field is equal to given action field
// & replaces fieldToChange of found element with newVal
export const findAndReplace = (arr, field, actionField, fieldToChange, newVal) => {
  const newArr = [...arr];
  const index = newArr.findIndex(entry => entry[field] === actionField);
  const newEntry = { ...newArr[index] };
  newEntry[fieldToChange] = newVal;
  newArr[index] = newEntry;
  return newArr;
};

// filter cards by search query mode & its dueDate
export const filterByDueDate = (mode, dueDate) => {
  const date = new Date(dueDate.dueDate);
  switch (mode) {
    case 'today': return isTomorrow(date) || isToday(date);
    case 'week': return isThisWeek(date);
    case 'month': return isThisMonth(date);
    case 'overdue': return isPast(date);
    case 'complete': return dueDate.isComplete === true;
    case 'incomplete': return dueDate.isComplete === false;
    default: return false;
  }
};
