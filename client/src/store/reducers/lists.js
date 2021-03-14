import * as actionTypes from '../actions/actionTypes';
import { isToday, isTomorrow, isThisWeek, isThisMonth, isPast } from 'date-fns';

const initialState = {
  lists: [],
  shownCardID: null,
  shownListID: null,
  currentCard: null,
  currentListTitle: null,
  allArchivedCards: [],
  archivedLists: [],
  searchQueries: {
    titleQuery: '',
    memberQuery: '',
    dueDateQuery: '',
    labels: [],
    customLabels: []
  },
  filteredLists: [],
  cardsAreFiltered: false,
  votingResultsListID: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_LIST_DATA: return setListData(state, action);
    case actionTypes.UPDATE_LIST_TITLE: return updateListTitle(state, action);
    case actionTypes.ADD_LIST: return addList(state, action);
    case actionTypes.ADD_CARD: return addCard(state, action);
    case actionTypes.SET_CARD_DETAILS: return setCardDetails(state, action);
    case actionTypes.UPDATE_CARD_TITLE: return updateCardTitle(state, action);
    case actionTypes.UPDATE_CARD_DESC: return updateCardDesc(state, action);
    case actionTypes.ADD_CARD_LABEL: return addCardLabel(state, action);
    case actionTypes.REMOVE_CARD_LABEL: return removeCardLabel(state, action);
    case actionTypes.TOGGLE_DUE_DATE: return toggleDueDate(state, action);
    case actionTypes.ADD_DUE_DATE: return addDueDate(state, action);
    case actionTypes.REMOVE_DUE_DATE: return removeDueDate(state, action);
    case actionTypes.ADD_CHECKLIST: return addChecklist(state, action);
    case actionTypes.DELETE_CHECKLIST: return deleteChecklist(state, action);
    case actionTypes.EDIT_CHECKLIST_TITLE: return editChecklistTitle(state, action);
    case actionTypes.ADD_CHECKLIST_ITEM: return addChecklistItem(state, action);
    case actionTypes.TOGGLE_CHECKLIST_ITEM: return toggleChecklistItem(state, action);
    case actionTypes.EDIT_CHECKLIST_ITEM: return editChecklistItem(state, action);
    case actionTypes.DELETE_CHECKLIST_ITEM: return deleteChecklistItem(state, action);
    case actionTypes.MOVE_LIST: return moveList(state, action);
    case actionTypes.MOVE_CARD_SAME_LIST: return moveCardSameList(state, action);
    case actionTypes.MOVE_CARD_DIFF_LIST: return moveCardDiffList(state, action);
    case actionTypes.COPY_CARD: return copyCard(state, action);
    case actionTypes.ARCHIVE_CARD: return archiveCard(state, action);
    case actionTypes.RECOVER_CARD: return recoverCard(state, action);
    case actionTypes.DELETE_CARD: return deleteCard(state, action);
    case actionTypes.COPY_LIST: return copyList(state, action);
    case actionTypes.ARCHIVE_LIST: return archiveList(state, action);
    case actionTypes.UNDO_ARCHIVE_LIST: return recoverList(state, action, false);
    case actionTypes.RECOVER_LIST: return recoverList(state, action, true);
    case actionTypes.DELETE_LIST: return deleteList(state, action);
    case actionTypes.ARCHIVE_ALL_CARDS: return archiveAllCards(state, action);
    case actionTypes.MOVE_ALL_CARDS: return moveAllCards(state, action);
    case actionTypes.ADD_CARD_MEMBER: return addCardMember(state, action);
    case actionTypes.REMOVE_CARD_MEMBER: return removeCardMember(state, action);
    case actionTypes.ADD_COMMENT: return addComment(state, action);
    case actionTypes.UPDATE_COMMENT: return updateComment(state, action);
    case actionTypes.DELETE_COMMENT: return deleteComment(state, action);
    case actionTypes.DELETE_BOARD_MEMBER: return deleteBoardMember(state, action);
    case actionTypes.LEAVE_BOARD: return { ...initialState };
    case actionTypes.LOGOUT: return { ...initialState };
    case actionTypes.ADD_TITLE_SEARCH_QUERY: return addTitleSearchQuery(state, action);
    case actionTypes.ADD_MEMBER_SEARCH_QUERY: return addMemberSearchQuery(state, action);
    case actionTypes.ADD_LABEL_SEARCH_QUERY: return addLabelSearchQuery(state, action);
    case actionTypes.ADD_CUSTOM_LABEL_SEARCH_QUERY: return addCustomLabelSearchQuery(state, action);
    case actionTypes.ADD_DUE_DATE_SEARCH_QUERY: return addDueDateSearchQuery(state, action);
    case actionTypes.RESET_SEARCH_QUERY: return resetSearchQuery(state, action);
    case actionTypes.MOVE_CHECKLIST_ITEM: return moveChecklistItem(state, action);
    case actionTypes.TOGGLE_COMMENT_LIKE: return toggleCommentLike(state, action);
    case actionTypes.ADD_CUSTOM_FIELD: return addCustomField(state, action);
    case actionTypes.UPDATE_CUSTOM_FIELD_TITLE: return updateCustomFieldTitle(state, action);
    case actionTypes.UPDATE_CUSTOM_FIELD_VALUE: return updateCustomFieldValue(state, action);
    case actionTypes.DELETE_CUSTOM_FIELD: return deleteCustomField(state, action);
    case actionTypes.TOGGLE_LIST_VOTING: return toggleListVoting(state, action);
    case actionTypes.TOGGLE_CARD_VOTE: return toggleCardVote(state, action);
    case actionTypes.SET_LIST_LIMIT: return setListLimit(state, action);
    case actionTypes.REMOVE_LIST_LIMIT: return removeListLimit(state, action);
    case actionTypes.MOVE_CUSTOM_FIELD: return moveCustomField(state, action);
    case actionTypes.SORT_LIST: return sortList(state, action);
    case actionTypes.SET_VOTING_RESULTS_ID: return { ...state, votingResultsListID: action.listID };
    case actionTypes.CLOSE_VOTING_RESULTS: return { ...state, votingResultsListID: null };
    case actionTypes.ADD_CARD_CUSTOM_LABEL: return addCardCustomLabel(state, action);
    case actionTypes.DELETE_CARD_CUSTOM_LABEL: return deleteCardCustomLabel(state, action);
    case actionTypes.DELETE_CUSTOM_LABEL: return deleteCustomLabel(state, action);
    case actionTypes.CHANGE_CHECKLIST_ITEM_MEMBER: return changeChecklistItemMember(state, action);
    case actionTypes.REMOVE_CHECKLIST_ITEM_MEMBER: return removeChecklistItemMember(state, action);
    default: return state;
  }
};

// find a card within a list based on listID/cardID
const findCard = (state, listID, cardID) => {
  const lists = [...state.lists];
  const listIndex = lists.findIndex(list => list.listID === listID);
  const list = { ...lists[listIndex] };
  const cards = [...list.cards];
  const cardIndex = cards.findIndex(card => card.cardID === cardID);
  const card = { ...cards[cardIndex] };
  return { lists, listIndex, list, cards, cardIndex, card };
};

const getFilteredLists = (state, lists) => (
  state.cardsAreFiltered ? filterListsHelper(state.searchQueries, lists) : state.filteredLists
);

// filter cards by search query mode & its dueDate
const filterByDueDate = (mode, dueDate) => {
  const date = new Date(dueDate.dueDate);
  switch (mode) {
    case 'today': return isTomorrow(date) || isToday(date);
    case 'week': return isThisWeek(date);
    case 'month': return isThisMonth(date);
    case 'overdue': return isPast(date) && dueDate.isComplete === false;
    case 'complete': return dueDate.isComplete === true;
    case 'incomplete': return dueDate.isComplete === false;
    default: return false;
  }
};

// update lists state after updating a card
const updateLists = (cards, cardIndex, card, list, lists, listIndex, state) => {
  cards[cardIndex] = card;
  list.cards = cards;
  lists[listIndex] = list;
  const filteredLists = getFilteredLists(state, lists);
  return { ...state, lists, currentCard: { ...card, listIsVoting: list.isVoting }, filteredLists };
};

// finds checklist items within a card based on ID
const findChecklistItems = (card, checklistID) => {
  const checklists = [...card.checklists];
  const checklistIndex = checklists.findIndex(checklist => checklist.checklistID === checklistID);
  const checklist = { ...checklists[checklistIndex] };
  const items = [...checklist.items];
  return { checklists, checklistIndex, checklist, items };
};

const formatCardData = (card, fromList) => ({
  cardID: card._id,
  checklists: card.checklists.map(checklist => ({
    title: checklist.title,
    checklistID: checklist._id,
    items: checklist.items.map(item => ({
      itemID: item._id,
      title: item.title,
      isComplete: item.isComplete,
      member: item.member
    }))
  })),
  dueDate: card.dueDate,
  labels: card.labels,
  title: card.title,
  desc: card.desc,
  comments: fromList ? [] : card.comments.map(comment => {
    const { _id: commentID, ...restComment } = comment;
    return { ...restComment, commentID };
  }).reverse(),
  members: card.members,
  customFields: card.customFields.map(field => ({
    fieldType: field.fieldType,
    fieldTitle: field.fieldTitle,
    value: field.value,
    fieldID: field._id
  })),
  votes: fromList ? [] : card.votes,
  customLabels: card.customLabels
});

const setListData = (state, action) => ({
  ...state,
  lists: action.payload.lists,
  allArchivedCards: action.payload.allArchivedCards,
  archivedLists: action.payload.archivedLists
});

const updateListTitle = (state, action) => ({
  ...state,
  lists: state.lists.map(list => list.listID === action.listID ? { ...list, title: action.title } : list),
  currentListTitle: state.currentListTitle ? action.title : null,
  filteredLists: state.cardsAreFiltered ? state.filteredLists.map(list => list.listID === action.listID ? { ...list, title: action.title } : list) : state.filteredLists
});

const addList = (state, action) => {
  const list = { listID: action.listID, title: action.title, cards: [], indexInBoard: state.lists.length, isVoting: false, limit: null };
  const lists = [...state.lists, list];
  const filteredLists = state.cardsAreFiltered ? [...state.filteredLists, list] : state.filteredLists;
  return { ...state, lists, filteredLists };
};

const addCard = (state, action) => {
  const card = { title: action.title, desc: '', checklists: [], dueDate: null, labels: [],
  cardID: action.cardID, members: [], comments: [], customFields: [], votes: [], customLabels: [] };

  const lists = state.lists.map(list => list.listID === action.listID ? { ...list, cards: [...list.cards, card] } : list);

  const filteredLists = state.cardsAreFiltered && filterCardHelper(state.searchQueries, card) ?
    state.filteredLists.map(list => list.listID === action.listID ? { ...list, cards: [...list.cards, card] } : list) :
    state.filteredLists;

  return { ...state, lists, filteredLists };
};

const setCardDetails = (state, action) => ({
  ...state,
  shownCardID: action.cardID,
  shownListID: action.listID,
  currentCard: action.currentCard,
  currentListTitle: action.currentListTitle
});

const updateCardTitle = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  card.title = action.title;
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const updateCardDesc = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  card.desc = action.desc;
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const addCardLabel = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  card.labels = [...card.labels, action.color];
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const removeCardLabel = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  card.labels = card.labels.filter(label => label !== action.color);
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const toggleDueDate = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  card.dueDate = { ...card.dueDate, isComplete: !card.dueDate.isComplete };
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const addDueDate = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  card.dueDate = { dueDate: action.dueDate, startDate: action.startDate, isComplete: false };
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const removeDueDate = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  card.dueDate = null;
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const addChecklist = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  card.checklists = [...card.checklists, { title: action.title, items: [], checklistID: action.checklistID }];
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const deleteChecklist = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  card.checklists = card.checklists.filter(checklist => checklist.checklistID !== action.checklistID);
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const editChecklistTitle = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  card.checklists = card.checklists.map(checklist => {
    if (checklist.checklistID !== action.checklistID) { return checklist; }
    return { ...checklist, title: action.title };
  });
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const addChecklistItem = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  const { checklists, checklistIndex, checklist, items } = findChecklistItems(card, action.checklistID);
  items.push({ title: action.title, isComplete: false, itemID: action.itemID, member: null });
  checklist.items = items;
  checklists[checklistIndex] = checklist;
  card.checklists = checklists;
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const toggleChecklistItem = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  const { checklists, checklistIndex, checklist, items } = findChecklistItems(card, action.checklistID);
  const itemIndex = items.findIndex(item => item.itemID === action.itemID);
  items[itemIndex].isComplete = !items[itemIndex].isComplete;
  checklist.items = items;
  checklists[checklistIndex] = checklist;
  card.checklists = checklists;
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const editChecklistItem = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  const { checklists, checklistIndex, checklist, items } = findChecklistItems(card, action.checklistID);
  const itemIndex = items.findIndex(item => item.itemID === action.itemID);
  items[itemIndex].title = action.title;
  checklist.items = items;
  checklists[checklistIndex] = checklist;
  card.checklists = checklists;
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const deleteChecklistItem = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  const { checklists, checklistIndex, checklist, items } = findChecklistItems(card, action.checklistID);
  checklist.items = checklist.items.filter(item => item.itemID !== action.itemID);
  checklists[checklistIndex] = checklist;
  card.checklists = checklists;
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const moveList = (state, action) => {
  const lists = [...state.lists];
  const listIndex = lists.findIndex(list => list.indexInBoard === action.sourceIndex);
  const list = { ...lists[listIndex] };
  lists.splice(action.sourceIndex, 1);
  lists.splice(action.destIndex, 0, list);

  for (let i = 0; i < lists.length; i++) {
    if (lists[i].indexInBoard !== i) {
      lists[i] = { ...lists[i], indexInBoard: i };
    }
  }

  const filteredLists = getFilteredLists(state, lists);

  return { ...state, lists, filteredLists };
};

const moveCardSameList = (state, action) => {
  const lists = state.lists.map(list => {
    if (list.listID !== action.listID) { return list; }
    const cards = [...list.cards];
    const card = cards.splice(action.sourceIndex, 1)[0];
    cards.splice(action.destIndex, 0, card);
    return { ...list, cards };
  });

  const filteredLists = getFilteredLists(state, lists);

  return { ...state, lists, filteredLists };
};

const moveCardDiffList = (state, action) => {
  const lists = [...state.lists];
  const sourceIndex = lists.findIndex(list => list.listID === action.sourceID);
  const destIndex = lists.findIndex(list => list.listID === action.destID);
  const sourceList = { ...lists[sourceIndex] };
  const destList = { ...lists[destIndex] };
  const sourceCards = [...sourceList.cards];
  const card = { ...sourceCards.splice(action.sourceIndex, 1)[0] };
  const destCards = [...destList.cards];
  destCards.splice(action.destIndex, 0, card);
  sourceList.cards = sourceCards;
  destList.cards = destCards;
  lists[sourceIndex] = sourceList;
  lists[destIndex] = destList;

  const filteredLists = getFilteredLists(state, lists);

  if (state.currentCard && state.currentCard.cardID === card.cardID) {
    return { ...state, lists, filteredLists, shownListID: action.destID, currentListTitle: destList.title };
  }
  return { ...state, lists, filteredLists };
};

const copyCard = (state, action) => {
  const newCard = formatCardData(action.card);

  const targetID = action.sourceListID === action.destListID ? action.sourceListID : action.destListID;
  const lists = state.lists.map(list => {
    if (list.listID !== targetID) { return list; }
    const cards = [...list.cards];
    cards.splice(action.destIndex, 0, newCard);
    return { ...list, cards };
  });

  const filteredLists = getFilteredLists(state, lists);

  return { ...state, lists, filteredLists };
};

const archiveCard = (state, action) => {
  const lists = [...state.lists];
  const listIndex = lists.findIndex(list => list.listID === action.listID);
  const list = { ...lists[listIndex] };
  const cardIndex = list.cards.findIndex(card => card.cardID === action.cardID);
  const cards = [...list.cards];
  const card = cards.splice(cardIndex, 1)[0];
  list.cards = cards;
  lists[listIndex] = list;
  const allArchivedCards = [{ ...card, listID: action.listID }, ...state.allArchivedCards];

  let currentCard = state.currentCard;
  if (currentCard && currentCard.cardID === action.cardID) {
    currentCard = { ...state.currentCard, isArchived: true };
  }

  const filteredLists = getFilteredLists(state, lists);

  return { ...state, lists, allArchivedCards, currentCard, filteredLists };
};

const recoverCard = (state, action) => {
  const listIsArchived = !state.lists.find(list => list.listID === action.listID);

  let currentCard = state.currentCard;
  if (currentCard && currentCard.cardID === action.cardID) {
    currentCard = { ...state.currentCard, listIsArchived };
    delete currentCard.isArchived;
  }

  const allArchivedCards = [...state.allArchivedCards];
  const cardIndex = allArchivedCards.findIndex(card => card.cardID === action.cardID);
  const card = allArchivedCards.splice(cardIndex, 1)[0];
  delete card.listID;

  const lists = listIsArchived ? state.lists :
  state.lists.map(list => list.listID === action.listID ? { ...list, cards: [...list.cards, card] } : list);
  const filteredLists = listIsArchived ? state.filteredLists : getFilteredLists(state, lists);
  const archivedLists = !listIsArchived ? state.archivedLists :
  state.archivedLists.map(list => list.listID === action.listID ? { ...list, cards: [...list.cards, card] } : list);

  return { ...state, lists, archivedLists, allArchivedCards, currentCard, filteredLists };
};

const deleteCard = (state, action) => {
  const allArchivedCards = state.allArchivedCards.filter(card => card.cardID !== action.cardID);

  if (state.currentCard && state.currentCard.cardID === action.cardID) {
    return { ...state, allArchivedCards, currentCard: null, shownCardID: null, shownListID: null, currentListTitle: null };
  }
  return { ...state, allArchivedCards };
};

const copyList = (state, action) => {
  const newList = {
    indexInBoard: action.newList.indexInBoard,
    listID: action.newList._id,
    title: action.newList.title,
    isArchived: false,
    isVoting: false,
    limit: action.newList.limit,
    cards: action.newList.cards.map(card => formatCardData(card, true))
  };

  const lists = [...state.lists, newList];
  const filteredLists = getFilteredLists(state, lists);

  return { ...state, lists, filteredLists };
};

const archiveList = (state, action) => {
  const lists = [...state.lists];
  const listIndex = lists.findIndex(list => list.listID === action.listID);
  const archivedList = { ...lists.splice(listIndex, 1)[0], isArchived: true };
  for (let i = 0; i < lists.length; i++) {
    if (lists[i].indexInBoard !== i) {
      lists[i] = { ...lists[i], indexInBoard: i };
    }
  }
  const archivedLists = [...state.archivedLists, archivedList];

  const filteredLists = getFilteredLists(state, lists);

  let currentCard = state.currentCard;
  if (currentCard && state.shownListID === action.listID) {
    currentCard = { ...state.currentCard, listIsArchived: true };
  }
  return { ...state, lists, archivedLists, currentCard, filteredLists };
};

const recoverList = (state, action, addToEnd) => {
  const lists = [...state.lists];
  const archivedLists = [...state.archivedLists];
  const listIndex = archivedLists.findIndex(list => list.listID === action.listID);
  const archivedList = { ...archivedLists.splice(listIndex, 1)[0], isArchived: false };

  // if list is being recovered then make indexInBoard lists.length else if archiving
  // is being undone then make indexInBoard stay as original index
  if (addToEnd) {
    archivedList.indexInBoard = lists.length;
    lists.push(archivedList);
  } else {
    lists.splice(archivedList.indexInBoard, 0, archivedList);
  }

  const filteredLists = getFilteredLists(state, lists);

  let currentCard = state.currentCard;
  if (currentCard && state.shownListID === action.listID) {
    currentCard = { ...state.currentCard };
    delete currentCard.listIsArchived;
  }
  return { ...state, lists, archivedLists, currentCard, filteredLists };
};

const deleteList = (state, action) => {
  const archivedLists = state.archivedLists.filter(list => list.listID !== action.listID);
  const allArchivedCards = state.allArchivedCards.filter(card => card.listID !== action.listID);

  if (state.currentCard && state.shownListID === action.listID) {
    return { ...state, archivedLists, allArchivedCards, currentCard: null, shownCardID: null, shownListID: null, currentListTitle: null };
  }
  return { ...state, archivedLists, allArchivedCards };
};

const archiveAllCards = (state, action) => {
  const lists = [...state.lists];
  const listIndex = lists.findIndex(list => list.listID === action.listID);
  const allArchivedCards = state.allArchivedCards.concat(lists[listIndex].cards.map(card => ({ ...card, listID: lists[listIndex].listID })));
  lists[listIndex] = { ...lists[listIndex], cards: [] };

  const filteredLists = getFilteredLists(state, lists);

  let currentCard = state.currentCard;
  if (currentCard && state.shownListID === action.listID) {
    currentCard = { ...state.currentCard, isArchived: true };
  }
  return { ...state, lists, allArchivedCards, currentCard, filteredLists };
};

const moveAllCards = (state, action) => {
  const lists = [...state.lists];
  const oldIndex = lists.findIndex(list => list.listID === action.oldListID);
  const newIndex = lists.findIndex(list => list.listID === action.newListID);
  lists[newIndex] = { ...lists[newIndex], cards: lists[newIndex].cards.concat([...lists[oldIndex].cards]) };
  lists[oldIndex] = { ...lists[oldIndex], cards: [] };

  const filteredLists = getFilteredLists(state, lists);

  if (state.currentCard && state.shownListID === action.oldListID) {
    return { ...state, lists, shownListID: action.newListID, currentListTitle: lists[newIndex].title, filteredLists };
  }
  return { ...state, lists, filteredLists };
};

const addCardMember = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  // check if user already member
  if (card.members.find(member => member.email === action.email)) { return state; }
  card.members = [...card.members, { email: action.email, fullName: action.fullName }];
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const removeCardMember = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  card.members = card.members.filter(member => member.email !== action.email);
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const addComment = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.payload.listID, action.payload.cardID);
  card.comments = [{ ...action.payload, likes: [] }, ...card.comments];
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const updateComment = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  card.comments = card.comments.map(comment => comment.commentID === action.commentID ? { ...comment, msg: action.msg } : comment);
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const deleteComment = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  card.comments = card.comments.filter(comment => comment.commentID !== action.commentID);
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const toggleCommentLike = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  card.comments = card.comments.map(comment => {
    if (comment.commentID !== action.commentID) { return comment; }
    if (comment.likes.includes(action.email)) {
      return { ...comment, likes: comment.likes.filter(like => like !== action.email) };
    }
    return { ...comment, likes: [...comment.likes, action.email] };
  });
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const deleteBoardMember = (state, action) => {
  // remove member from any cards they are a member of
  let currentCard = state.currentCard;

  const updateCard = card => {
    const members = card.members.filter(member => member.email !== action.email);
    const votes = card.votes.filter(vote => vote.email !== action.email);
    const checklists = card.checklists.map(checklist => ({
      ...checklist,
      items: checklist.items.map(item => ({ ...item, member: item.member?.email === action.email ? null : item.member }))
    }));
    if (state.shownCardID === card.cardID) {
      currentCard = { ...currentCard, members, votes };
    }
    return { ...card, members, votes, checklists };
  };

  const lists = state.lists.map(list => ({
    ...list,
    cards: list.cards.map(card => updateCard(card))
  }));

  const archivedLists = state.archivedLists.map(list => ({
    ...list,
    cards: list.cards.map(card => updateCard(card))
  }));

  const allArchivedCards = state.allArchivedCards.map(card => updateCard(card));

  const filteredLists = getFilteredLists(state, lists);

  return { ...state, lists, filteredLists, currentCard, archivedLists, allArchivedCards };
};

const checkForQuery = searchQueries => {
  // return false if no queries, else true
  if (!searchQueries.titleQuery && !searchQueries.dueDateQuery &&
  !searchQueries.memberQuery && !searchQueries.labels.length &&
  !searchQueries.customLabels.length) { return false; }
  return true;
};

const filterListsHelper = (searchQueries, lists) => {
  // filters all cards in all lists by search queries
  const { titleQuery, dueDateQuery, memberQuery, labels, customLabels } = searchQueries;
  lists = lists.map(list => {
    let updatedCards = list.cards.filter(card => {
      if (titleQuery && !card.title.includes(titleQuery)) { return false; }
      if (memberQuery && !card.members.find(member => member.email === memberQuery)) { return false; }
      if (labels.length && !card.labels.length) { return false; }
      if (labels.length && !labels.every(label => card.labels.includes(label))) { return false; }
      if (customLabels.length && !card.customLabels.length) { return false; }
      if (customLabels.length && !customLabels.every(label => card.customLabels.includes(label))) { return false; }
      if (dueDateQuery && !card.dueDate) { return false; }
      if (dueDateQuery && !filterByDueDate(dueDateQuery, card.dueDate)) { return false; }
      return true;
    });
    return { ...list, cards: updatedCards.length === list.cards.length ? list.cards : updatedCards };
  });
  return lists;
};

const filterCardHelper = (searchQueries, card) => {
  // returns true if card passes all search queries else returns false
  const { titleQuery, dueDateQuery, memberQuery, labels, customLabels } = searchQueries;
  if (titleQuery && !card.title.includes(titleQuery)) { return false; }
  if (memberQuery && !card.members.find(member => member.email === memberQuery)) { return false; }
  if (labels.length && !card.labels.length) { return false; }
  if (labels.length && !labels.every(label => card.labels.includes(label))) { return false; }
  if (customLabels.length && !customLabels.every(label => card.customLabels.includes(label))) { return false; }
  if (dueDateQuery && !card.dueDate) { return false; }
  if (dueDateQuery && !filterByDueDate(dueDateQuery, card.dueDate)) { return false; }
  return true;
};

const addTitleSearchQuery = (state, action) => {
  const searchQueries = { ...state.searchQueries, titleQuery: action.title };

  if (!action.title && !checkForQuery(searchQueries)) {
    return { ...state, searchQueries, cardsAreFiltered: false, filteredLists: [] };
  }
  const filteredLists = filterListsHelper(searchQueries, state.lists);
  return { ...state, searchQueries, cardsAreFiltered: true, filteredLists };
};

const addLabelSearchQuery = (state, action) => {
  const labels = [...state.searchQueries.labels];
  const labelIndex = labels.indexOf(action.label);
  labelIndex === -1 ? labels.push(action.label) : labels.splice(labelIndex, 1);
  const searchQueries = { ...state.searchQueries, labels };

  if (!labels.length && !checkForQuery(searchQueries)) {
    return { ...state, searchQueries, cardsAreFiltered: false, filteredLists: [] };
  }
  const filteredLists = filterListsHelper(searchQueries, state.lists);
  return { ...state, searchQueries, cardsAreFiltered: true, filteredLists };
};

const addCustomLabelSearchQuery = (state, action) => {
  const customLabels = [...state.searchQueries.customLabels];
  const labelIndex = customLabels.indexOf(action.labelID);
  labelIndex === -1 ? customLabels.push(action.labelID) : customLabels.splice(labelIndex, 1);
  const searchQueries = { ...state.searchQueries, customLabels };

  if (!customLabels.length && !checkForQuery(searchQueries)) {
    return { ...state, searchQueries, cardsAreFiltered: false, filteredLists: [] };
  }
  const filteredLists = filterListsHelper(searchQueries, state.lists);
  return { ...state, searchQueries, cardsAreFiltered: true, filteredLists };
};

const addMemberSearchQuery = (state, action) => {
  const searchQueries = { ...state.searchQueries, memberQuery: action.email };
  if (!action.email && !checkForQuery(searchQueries)) {
    return { ...state, searchQueries, cardsAreFiltered: false, filteredLists: [] };
  }
  const filteredLists = filterListsHelper(searchQueries, state.lists);
  return { ...state, searchQueries, cardsAreFiltered: true, filteredLists };
};

const addDueDateSearchQuery = (state, action) => {
  const searchQueries = { ...state.searchQueries, dueDateQuery: action.query };
  if (!action.query && !checkForQuery(searchQueries)) {
    return { ...state, searchQueries, cardsAreFiltered: false, filteredLists: [] };
  }
  const filteredLists = filterListsHelper(searchQueries, state.lists);
  return { ...state, searchQueries, cardsAreFiltered: true, filteredLists };
};

const resetSearchQuery = (state, action) => {
  const searchQueries = {
    titleQuery: '',
    memberQuery: '',
    dueDateQuery: '',
    labels: [],
    customLabels: []
  };
  return { ...state, cardsAreFiltered: false, searchQueries, filteredLists: [] };
};

const moveChecklistItem = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  const { checklists, checklistIndex, checklist, items } = findChecklistItems(card, action.checklistID);
  const item = items.splice(action.sourceIndex, 1)[0];
  items.splice(action.destIndex, 0, item);
  checklist.items = items;
  checklists[checklistIndex] = checklist;
  card.checklists = checklists;
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const addCustomField = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  const value = action.fieldType === 'Date' ? null : action.fieldType === 'Checkbox' ? false : '';
  const newField = { fieldID: action.fieldID, fieldType: action.fieldType, fieldTitle: action.fieldTitle, value };
  card.customFields = [...card.customFields, newField];
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const updateCustomFieldTitle = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  card.customFields = card.customFields.map(field => field.fieldID === action.fieldID ? { ...field, fieldTitle: action.fieldTitle } : field);
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const updateCustomFieldValue = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  card.customFields = card.customFields.map(field => field.fieldID === action.fieldID ? { ...field, value: action.value } : field);
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const deleteCustomField = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  card.customFields = card.customFields.filter(({ fieldID }) => fieldID !== action.fieldID);
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const toggleListVoting = (state, action) => {
  let isVoting = false;
  const lists = state.lists.map(list => {
    if (list.listID !== action.listID) { return list; }
    isVoting = !list.isVoting;
    return { ...list, isVoting, cards: isVoting ? list.cards : list.cards.map(card => ({ ...card, votes: [] })) };
  });

  const filteredLists = getFilteredLists(state, lists);

  let currentCard = state.currentCard;
  if (currentCard && state.shownListID === action.listID) {
    currentCard = { ...state.currentCard, listIsVoting: isVoting, votes: isVoting ? currentCard.votes : [] };
  }

  return { ...state, lists, filteredLists, currentCard };
};

const toggleCardVote = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  const voteIdx = card.votes.findIndex(vote => vote.email === action.email);
  if (voteIdx === -1) {
    card.votes = [...card.votes, { email: action.email, fullName: action.fullName }];
  } else {
    card.votes = card.votes.filter(vote => vote.email !== action.email);
  }
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const setListLimit = (state, action) => ({
  ...state,
  lists: state.lists.map(list => list.listID === action.listID ? { ...list, limit: action.limit } : list),
  filteredLists: state.cardsAreFiltered ? state.filteredLists.map(list => list.listID === action.listID ? { ...list, limit: action.limit } : list) : state.filteredLists
});

const removeListLimit = (state, action) => ({
  ...state,
  lists: state.lists.map(list => list.listID === action.listID ? { ...list, limit: null } : list),
  filteredLists: state.cardsAreFiltered ? state.filteredLists.map(list => list.listID === action.listID ? { ...list, limit: null } : list) : state.filteredLists
});

const moveCustomField = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  const customFields = [...card.customFields];
  const field = customFields.splice(action.sourceIndex, 1)[0];
  customFields.splice(action.destIndex, 0, field);
  card.customFields = customFields;
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const sortList = (state, action) => {
  const lists = state.lists.map(list => list.listID === action.listID ? { ...list, cards: action.cards.map(card => formatCardData(card)) } : list);
  const filteredLists = getFilteredLists(state, lists);
  return { ...state, lists, filteredLists };
};

const addCardCustomLabel = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  card.customLabels = [...card.customLabels, action.labelID];
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const deleteCardCustomLabel = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  card.customLabels = card.customLabels.filter(label => label !== action.labelID);
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const deleteCustomLabel = (state, action) => {
  let currentCard = state.currentCard;

  const updateCard = card => {
    const customLabels = card.customLabels.filter(id => id !== action.labelID);
    if (customLabels.length === card.customLabels.length) { return card; }
    if (state.shownCardID === card.cardID) {
      currentCard = { ...currentCard, customLabels };
    }
    return { ...card, customLabels };
  };

  const lists = state.lists.map(list => ({
    ...list,
    cards: list.cards.map(card => updateCard(card))
  }));

  const archivedLists = state.archivedLists.map(list => ({
    ...list,
    cards: list.cards.map(card => updateCard(card))
  }));

  const allArchivedCards = state.allArchivedCards.map(card => updateCard(card));

  const filteredLists = getFilteredLists(state, lists);

  return { ...state, lists, filteredLists, currentCard, archivedLists, allArchivedCards };
};

const changeChecklistItemMember = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  const { checklists, checklistIndex, checklist, items } = findChecklistItems(card, action.checklistID);
  const itemIndex = items.findIndex(item => item.itemID === action.itemID);
  items[itemIndex].member = action.member;
  checklist.items = items;
  checklists[checklistIndex] = checklist;
  card.checklists = checklists;
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const removeChecklistItemMember = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  const { checklists, checklistIndex, checklist, items } = findChecklistItems(card, action.checklistID);
  const itemIndex = items.findIndex(item => item.itemID === action.itemID);
  items[itemIndex].member = null;
  checklist.items = items;
  checklists[checklistIndex] = checklist;
  card.checklists = checklists;
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

export default reducer;
