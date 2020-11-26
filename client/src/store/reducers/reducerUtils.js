// concats arr1 to arr2 & sorts by date descending
export const concatSort = (arr1, arr2) => arr1.concat(arr2).sort((a,b) => new Date(b.date) - new Date(a.date));

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

// finds index in state array where a given field is equal to given action field
// & toggles fieldToChange to opposite of its boolean value
export const findAndToggle = (arr, field, actionField, fieldToChange) => {
  const newArr = [...arr];
  const index = newArr.findIndex(entry => entry[field] === actionField);
  const newEntry = { ...newArr[index] };
  newEntry[fieldToChange] = !newEntry[fieldToChange];
  newArr[index] = newEntry;
  return newArr;
};
