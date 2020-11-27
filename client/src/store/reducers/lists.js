import * as actionTypes from '../actions/actionTypes';
import { findAndReplace } from './reducerUtils';

const initialState = {
  lists: [],
  shownCardID: null,
  shownListID: null,
  currentCard: null,
  currentListTitle: null,
  allArchivedCards: [],
  archivedLists: []
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
    case actionTypes.RECOVER_LIST: return recoverList(state, action);
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

// update lists state after updating a card
const updateLists = (cards, cardIndex, card, list, lists, listIndex, state) => {
  cards[cardIndex] = card;
  list.cards = cards;
  lists[listIndex] = list;
  return { ...state, lists, currentCard: card };
};

// finds checklist items within a card based on ID
const findChecklistItems = (card, checklistID) => {
  const checklists = [...card.checklists];
  const checklistIndex = checklists.findIndex(checklist => checklist.checklistID === checklistID);
  const checklist = { ...checklists[checklistIndex] };
  const items = [...checklist.items];
  return { checklists, checklistIndex, checklist, items };
};

const setListData = (state, action) => ({
  ...state,
  lists: action.payload.lists,
  allArchivedCards: action.payload.allArchivedCards,
  archivedLists: action.payload.archivedLists
});

const updateListTitle = (state, action) => {
  const lists = findAndReplace(state.lists, 'listID', action.listID, 'title', action.title);
  const currentListTitle = state.currentListTitle ? action.title : null;
  return { ...state, lists, currentListTitle };
};

const addList = (state, action) => {
  const list = { listID: action.listID, title: action.title, cards: [], indexInBoard: state.lists.length };
  const lists = [...state.lists];
  lists.push(list);
  return { ...state, lists };
};

const addCard = (state, action) => {
  const index = state.lists.findIndex(list => list.listID === action.listID);
  const cards = [...state.lists[index].cards];
  cards.push({ title: action.title, desc: '', checklists: [], dueDate: null, labels: [], cardID: action.cardID, members: [], comments: [] });
  const lists = [...state.lists];
  lists[index].cards = cards;
  return { ...state, lists };
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
  const labels = [...card.labels, action.color];
  card.labels = labels;
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const removeCardLabel = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  const labels = [...card.labels];
  labels.splice(labels.indexOf(action.color), 1);
  card.labels = labels;
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const toggleDueDate = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  const dueDate = {...card.dueDate};
  dueDate.isComplete = !dueDate.isComplete;
  card.dueDate = dueDate;
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const addDueDate = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  const dueDate = { dueDate: action.dueDate, isComplete: false };
  card.dueDate = dueDate;
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const removeDueDate = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  card.dueDate = null;
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const addChecklist = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  const checklists = [...card.checklists];
  checklists.push({ title: action.title, items: [], checklistID: action.checklistID });
  card.checklists = checklists;
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const deleteChecklist = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  const checklists = [...card.checklists];
  const checklistIndex = checklists.findIndex(checklist => checklist.checklistID === action.checklistID);
  checklists.splice(checklistIndex, 1);
  card.checklists = checklists;
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const editChecklistTitle = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  const checklists = [...card.checklists];
  const checklistIndex = checklists.findIndex(checklist => checklist.checklistID === action.checklistID);
  const checklist = { ...checklists[checklistIndex] };
  checklist.title = action.title;
  checklists[checklistIndex] = checklist;
  card.checklists = checklists;
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const addChecklistItem = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  const { checklists, checklistIndex, checklist, items } = findChecklistItems(card, action.checklistID);
  items.push({ title: action.title, isComplete: false, itemID: action.itemID });
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
  const itemIndex = items.findIndex(item => item.itemID === action.itemID);
  items.splice(itemIndex, 1);
  checklist.items = items;
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
      const list = { ...lists[i] };
      list.indexInBoard = i;
      lists[i] = list;
    }
  }
  return { ...state, lists };
};

const moveCardSameList = (state, action) => {
  const lists = [...state.lists];
  const listIndex = lists.findIndex(list => list.listID === action.listID);
  const list = { ...lists[listIndex] };
  const cards = [...list.cards];
  const card = cards.splice(action.sourceIndex, 1)[0];
  cards.splice(action.destIndex, 0, card);
  list.cards = cards;
  lists[listIndex] = list;
  return { ...state, lists };
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
  if (state.currentCard && state.currentCard.cardID === card.cardID) {
    return { ...state, lists, shownListID: action.destID, currentListTitle: destList.title }
  }
  return { ...state, lists };
};

const copyCard = (state, action) => {
  const lists = [...state.lists];
  const listIndex = action.sourceListID === action.destListID ?
  lists.findIndex(list => list.listID === action.sourceListID) :
  lists.findIndex(list => list.listID === action.destListID);
  const list = { ...lists[listIndex] };
  const cards = [...list.cards];
  const checklists = action.checklists.map(checklist => ({
    title: checklist.title,
    checklistID: checklist._id,
    items: checklist.items.map(item => ({
      itemID: item._id,
      title: item.title,
      isComplete: item.isComplete
    }))
  }));
  const newCard = { title: action.title, desc: '', checklists, dueDate: null, cardID: action.newCardID, members: [], comments: [] };
  newCard.labels = action.keepLabels ? [...action.currentCard.labels] : [];
  cards.splice(action.destIndex, 0, newCard);
  list.cards = cards;
  lists[listIndex] = list;
  return { ...state, lists };
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
  const allArchivedCards = [...state.allArchivedCards];
  allArchivedCards.unshift({ ...card, listID: action.listID });
  if (state.currentCard && state.currentCard.cardID === action.cardID) {
    const currentCard = { ...state.currentCard };
    currentCard.isArchived = true;
    return { ...state, lists, allArchivedCards, currentCard };
  }
  return { ...state, lists, allArchivedCards };
};

const recoverCard = (state, action) => {
  const listIsArchived = !state.lists.find(list => list.listID === action.listID);
  if (!listIsArchived) {
    const lists = [...state.lists];
    const listIndex = lists.findIndex(list => list.listID === action.listID);
    const list = { ...lists[listIndex] };
    const allArchivedCards = [...state.allArchivedCards];
    const cardIndex = allArchivedCards.findIndex(card => card.cardID === action.cardID);
    const card = allArchivedCards.splice(cardIndex, 1)[0];
    delete card.listID;
    const cards = [...list.cards];
    cards.push(card);
    list.cards = cards;
    lists[listIndex] = list;
    if (state.currentCard && state.currentCard.cardID === action.cardID) {
      const currentCard = { ...state.currentCard };
      delete currentCard.isArchived;
      return { ...state, lists, allArchivedCards, currentCard };
    }
    return { ...state, lists, allArchivedCards };
  } else {
    const archivedLists = [...state.archivedLists];
    const listIndex = archivedLists.findIndex(list => list.listID === action.listID);
    const list = { ...archivedLists[listIndex] };
    const allArchivedCards = [...state.allArchivedCards];
    const cardIndex = allArchivedCards.findIndex(card => card.cardID === action.cardID);
    const card = allArchivedCards.splice(cardIndex, 1)[0];
    delete card.listID;
    const cards = [...list.cards];
    cards.push(card);
    list.cards = cards;
    archivedLists[listIndex] = list;
    if (state.currentCard && state.currentCard.cardID === action.cardID) {
      const currentCard = { ...state.currentCard };
      delete currentCard.isArchived;
      currentCard.listIsArchived = true;
      return { ...state, archivedLists, allArchivedCards, currentCard };
    }
    return { ...state, archivedLists, allArchivedCards };
  }
};

const deleteCard = (state, action) => {
  const allArchivedCards = [...state.allArchivedCards];
  const cardIndex = allArchivedCards.findIndex(card => card.cardID === action.cardID);
  allArchivedCards.splice(cardIndex, 1);
  if (state.currentCard && state.currentCard.cardID === action.cardID) {
    return { ...state, allArchivedCards, currentCard: null, shownCardID: null, shownListID: null, currentListTitle: null };
  }
  return { ...state, allArchivedCards };
};

const copyList = (state, action) => {
  const lists = [...state.lists];
  const newList = {
    indexInBoard: action.newList.indexInBoard,
    listID: action.newList._id,
    title: action.newList.title,
    isArchived: false,
    cards: action.newList.cards.map(card => ({
      cardID: card._id,
      checklists: card.checklists.map(checklist => ({
        title: checklist.title,
        checklistID: checklist._id,
        items: checklist.items.map(item => ({
          itemID: item._id,
          title: item.title,
          isComplete: item.isComplete
        }))
      })),
      dueDate: card.dueDate,
      labels: card.labels,
      title: card.title,
      desc: card.desc,
      comments: [],
      members: card.members
    }))
  };
  lists.push(newList);
  return { ...state, lists };
};

const archiveList = (state, action) => {
  const lists = [...state.lists];
  const listIndex = lists.findIndex(list => list.listID === action.listID);
  const archivedList = { ...lists.splice(listIndex, 1)[0] };
  archivedList.isArchived = true;
  archivedList.indexInBoard = lists.length;
  for (let i = 0; i < lists.length; i++) {
    if (lists[i].indexInBoard !== i) {
      const list = { ...lists[i] };
      list.indexInBoard = i;
      lists[i] = list;
    }
  }
  const archivedLists = [...state.archivedLists];
  archivedLists.push(archivedList);
  if (state.currentCard && state.shownListID === action.listID) {
    const currentCard = { ...state.currentCard };
    currentCard.listIsArchived = true;
    return { ...state, lists, archivedLists, currentCard };
  }
  return { ...state, lists, archivedLists };
};

const recoverList = (state, action) => {
  const lists = [...state.lists];
  const archivedLists = [...state.archivedLists];
  const listIndex = archivedLists.findIndex(list => list.listID === action.listID);
  const archivedList = { ...archivedLists.splice(listIndex, 1)[0], isArchived: false, indexInBoard: lists.length };
  lists.push(archivedList);
  if (state.currentCard && state.shownListID === action.listID) {
    const currentCard = { ...state.currentCard };
    delete currentCard.listIsArchived;
    return { ...state, lists, archivedLists, currentCard };
  }
  return { ...state, lists, archivedLists };
};

const deleteList = (state, action) => {
  const archivedLists = [...state.archivedLists];
  const listIndex = archivedLists.findIndex(list => list.listID === action.listID);
  archivedLists.splice(listIndex, 1);
  const allArchivedCards = state.allArchivedCards.filter(card => card.listID !== action.listID);
  if (state.currentCard && state.shownListID === action.listID) {
    return { ...state, archivedLists, allArchivedCards, currentCard: null, shownCardID: null, shownListID: null, currentListTitle: null };
  }
  return { ...state, archivedLists, allArchivedCards };
};

const archiveAllCards = (state, action) => {
  const lists = [...state.lists];
  const listIndex = lists.findIndex(list => list.listID === action.listID);
  const list = { ...lists[listIndex] };
  const allArchivedCards = state.allArchivedCards.concat(list.cards.map(card => ({ ...card, listID: list.listID })));
  list.cards = [];
  lists[listIndex] = list;
  if (state.currentCard && state.shownListID === action.listID) {
    const currentCard = { ...state.currentCard };
    currentCard.isArchived = true;
    return { ...state, lists, allArchivedCards, currentCard };
  }
  return { ...state, lists, allArchivedCards };
};

const moveAllCards = (state, action) => {
  const lists = [...state.lists];
  const oldListIndex = lists.findIndex(list => list.listID === action.oldListID);
  const newListIndex = lists.findIndex(list => list.listID === action.newListID);
  const oldList = { ...lists[oldListIndex] };
  const newList = { ...lists[newListIndex] };
  newList.cards = newList.cards.concat([...oldList.cards]);
  oldList.cards = [];
  lists[oldListIndex] = oldList;
  lists[newListIndex] = newList;
  if (state.currentCard && state.shownListID === action.oldListID) {
    return { ...state, lists, shownListID: action.newListID, currentListTitle: newList.title };
  }
  return { ...state, lists };
};

const addCardMember = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  const members = [...card.members];
  // check if user already member
  if (members.find(member => member.email === action.email)) { return state; }
  members.push({ email: action.email, fullName: action.fullName });
  card.members = members;
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const removeCardMember = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  card.members = card.members.filter(member => member.email !== action.email);
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const addComment = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.payload.listID, action.payload.cardID);
  const comments = [...card.comments];
  comments.unshift({ ...action.payload });
  card.comments = comments;
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const updateComment = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  const comments = [...card.comments];
  const commentIndex = comments.findIndex(comment => comment.commentID === action.commentID);
  const comment = { ...comments[commentIndex] };
  comment.msg = action.msg;
  comments[commentIndex] = comment;
  card.comments = comments;
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const deleteComment = (state, action) => {
  const { lists, listIndex, list, cards, cardIndex, card } = findCard(state, action.listID, action.cardID);
  const comments = [...card.comments];
  const commentIndex = comments.findIndex(comment => comment.commentID === action.commentID);
  comments.splice(commentIndex, 1);
  card.comments = comments;
  return updateLists(cards, cardIndex, card, list, lists, listIndex, state);
};

const deleteBoardMember = (state, action) => {
  // remove member from any cards they are a member of
  const lists = [...state.lists];
  for (let listIdx = 0; listIdx < lists.length; listIdx++) {
    const list = { ...lists[listIdx] };
    const cards = [...list.cards];
    let shouldUpdate = false;
    for (let cardIdx = 0; cardIdx < cards.length; cardIdx++) {
      const card = { ...cards[cardIdx] };
      const members = card.members.filter(member => member.email !== action.email);
      if (members.length !== card.members.length) {
        card.members = members;
        cards[cardIdx] = card;
        shouldUpdate = true;
      }
    }
    if (shouldUpdate) {
      list.cards = cards;
      lists[listIdx] = list;
    }
  }
  return { ...state, lists };
};

export default reducer;
