import * as actionTypes from '../actions/actionTypes';
const Entities = require('entities');

const initialState = {
  lists: [],
  shownCardID: null,
  shownListID: null,
  currentCard: null,
  currentListTitle: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_ACTIVE_BOARD: {
      const lists = action.payload.lists.map(list => ({
        indexInBoard: list.indexInBoard,
        listID: list._id,
        title: Entities.decode(list.title),
        cards: list.cards.map(card => ({
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
          title: Entities.decode(card.title),
          desc: Entities.decode(card.desc)
        }))
      })).sort((a,b) => a.indexInBoard - b.indexInBoard);
      return { ...state, lists };
    }
    case actionTypes.UPDATE_LIST_TITLE: {
      const lists = [...state.lists];
      const index = lists.findIndex(list => list.listID === action.listID);
      lists[index] = { ...lists[index], title: action.title };
      return { ...state, lists };
    }
    case actionTypes.ADD_LIST: {
      const list = { listID: action.listID, title: action.title, cards: [], indexInBoard: state.lists.length };
      const lists = [...state.lists];
      lists.push(list);
      return { ...state, lists };
    }
    case actionTypes.ADD_CARD: {
      const index = state.lists.findIndex(list => list.listID === action.listID);
      const cards = [...state.lists[index].cards];
      cards.push({ title: action.title, desc: '', checklists: [], dueDate: null, labels: [], cardID: action.cardID });
      const lists = [...state.lists];
      lists[index].cards = cards;
      return { ...state, lists };
    }
    case actionTypes.SET_CARD_DETAILS: {
      return {
        ...state,
        shownCardID: action.cardID,
        shownListID: action.listID,
        currentCard: action.currentCard,
        currentListTitle: action.currentListTitle
      };
    }
    case actionTypes.UPDATE_CARD_TITLE: {
      const lists = [...state.lists];
      const listIndex = lists.findIndex(list => list.listID === action.listID);
      const list = { ...lists[listIndex] };
      const cardIndex = list.cards.findIndex(card => card.cardID === action.cardID);
      const card = { ...list.cards[cardIndex], title: action.title };
      list.cards[cardIndex] = card;
      lists[listIndex] = list;
      return { ...state, lists, currentCard: card };
    }
    case actionTypes.UPDATE_CARD_DESC: {
      const lists = [...state.lists];
      const listIndex = lists.findIndex(list => list.listID === action.listID);
      const list = { ...lists[listIndex] };
      const cardIndex = list.cards.findIndex(card => card.cardID === action.cardID);
      const card = { ...list.cards[cardIndex], desc: action.desc };
      list.cards[cardIndex] = card;
      lists[listIndex] = list;
      return { ...state, lists, currentCard: card };
    }
    case actionTypes.ADD_CARD_LABEL: {
      const lists = [...state.lists];
      const listIndex = lists.findIndex(list => list.listID === action.listID);
      const list = { ...lists[listIndex] };
      const cardIndex = list.cards.findIndex(card => card.cardID === action.cardID);
      const card = { ...list.cards[cardIndex] };
      const labels = [...card.labels, action.color];
      card.labels = labels;
      list.cards[cardIndex] = card;
      lists[listIndex] = list;
      return { ...state, lists, currentCard: card };
    }
    case actionTypes.REMOVE_CARD_LABEL: {
      const lists = [...state.lists];
      const listIndex = lists.findIndex(list => list.listID === action.listID);
      const list = { ...lists[listIndex] };
      const cardIndex = list.cards.findIndex(card => card.cardID === action.cardID);
      const card = { ...list.cards[cardIndex] };
      const labels = [...card.labels];
      labels.splice(labels.indexOf(action.color), 1);
      card.labels = labels;
      list.cards[cardIndex] = card;
      lists[listIndex] = list;
      return { ...state, lists, currentCard: card };
    }
    case actionTypes.TOGGLE_DUE_DATE: {
      const lists = [...state.lists];
      const listIndex = lists.findIndex(list => list.listID === action.listID);
      const list = { ...lists[listIndex] };
      const cardIndex = list.cards.findIndex(card => card.cardID === action.cardID);
      const card = { ...list.cards[cardIndex] };
      const dueDate = {...card.dueDate};
      dueDate.isComplete = !dueDate.isComplete;
      card.dueDate = dueDate;
      list.cards[cardIndex] = card;
      lists[listIndex] = list;
      return { ...state, lists, currentCard: card };
    }
    case actionTypes.ADD_DUE_DATE: {
      const lists = [...state.lists];
      const listIndex = lists.findIndex(list => list.listID === action.listID);
      const list = { ...lists[listIndex] };
      const cardIndex = list.cards.findIndex(card => card.cardID === action.cardID);
      const card = { ...list.cards[cardIndex] };
      const dueDate = { dueDate: action.dueDate, isComplete: false };
      card.dueDate = dueDate;
      list.cards[cardIndex] = card;
      lists[listIndex] = list;
      return { ...state, lists, currentCard: card };
    }
    case actionTypes.REMOVE_DUE_DATE: {
      const lists = [...state.lists];
      const listIndex = lists.findIndex(list => list.listID === action.listID);
      const list = { ...lists[listIndex] };
      const cardIndex = list.cards.findIndex(card => card.cardID === action.cardID);
      const card = { ...list.cards[cardIndex] };
      card.dueDate = null;
      list.cards[cardIndex] = card;
      lists[listIndex] = list;
      return { ...state, lists, currentCard: card };
    }
    case actionTypes.ADD_CHECKLIST: {
      const lists = [...state.lists];
      const listIndex = lists.findIndex(list => list.listID === action.listID);
      const list = { ...lists[listIndex] };
      const cardIndex = list.cards.findIndex(card => card.cardID === action.cardID);
      const card = { ...list.cards[cardIndex] };
      const checklists = [...card.checklists];
      checklists.push({ title: action.title, items: [], checklistID: action.checklistID });
      card.checklists = checklists;
      list.cards[cardIndex] = card;
      lists[listIndex] = list;
      return { ...state, lists, currentCard: card };
    }
    case actionTypes.DELETE_CHECKLIST: {
      const lists = [...state.lists];
      const listIndex = lists.findIndex(list => list.listID === action.listID);
      const list = { ...lists[listIndex] };
      const cardIndex = list.cards.findIndex(card => card.cardID === action.cardID);
      const card = { ...list.cards[cardIndex] };
      const checklists = [...card.checklists];
      const checklistIndex = checklists.findIndex(checklist => checklist.checklistID === action.checklistID);
      checklists.splice(checklistIndex, 1);
      card.checklists = checklists;
      list.cards[cardIndex] = card;
      lists[listIndex] = list;
      return { ...state, lists, currentCard: card };
    }
    case actionTypes.ADD_CHECKLIST_ITEM: {
      const lists = [...state.lists];
      const listIndex = lists.findIndex(list => list.listID === action.listID);
      const list = { ...lists[listIndex] };
      const cardIndex = list.cards.findIndex(card => card.cardID === action.cardID);
      const card = { ...list.cards[cardIndex] };
      const checklists = [...card.checklists];
      const checklistIndex = checklists.findIndex(checklist => checklist.checklistID === action.checklistID);
      const checklist = {...checklists[checklistIndex]};
      const items = [...checklist.items];
      items.push({ title: action.title, isComplete: false, itemID: action.itemID });
      checklist.items = items;
      checklists[checklistIndex] = checklist;
      card.checklists = checklists;
      list.cards[cardIndex] = card;
      lists[listIndex] = list;
      return { ...state, lists, currentCard: card };
    }
    case actionTypes.TOGGLE_CHECKLIST_ITEM: {
      const lists = [...state.lists];
      const listIndex = lists.findIndex(list => list.listID === action.listID);
      const list = { ...lists[listIndex] };
      const cardIndex = list.cards.findIndex(card => card.cardID === action.cardID);
      const card = { ...list.cards[cardIndex] };
      const checklists = [...card.checklists];
      const checklistIndex = checklists.findIndex(checklist => checklist.checklistID === action.checklistID);
      const checklist = {...checklists[checklistIndex]};
      const items = [...checklist.items];
      const itemIndex = items.findIndex(item => item.itemID === action.itemID);
      items[itemIndex].isComplete = !items[itemIndex].isComplete;
      checklist.items = items;
      checklists[checklistIndex] = checklist;
      card.checklists = checklists;
      list.cards[cardIndex] = card;
      lists[listIndex] = list;
      return { ...state, lists, currentCard: card };
    }
    case actionTypes.EDIT_CHECKLIST_ITEM: {
      const lists = [...state.lists];
      const listIndex = lists.findIndex(list => list.listID === action.listID);
      const list = { ...lists[listIndex] };
      const cardIndex = list.cards.findIndex(card => card.cardID === action.cardID);
      const card = { ...list.cards[cardIndex] };
      const checklists = [...card.checklists];
      const checklistIndex = checklists.findIndex(checklist => checklist.checklistID === action.checklistID);
      const checklist = {...checklists[checklistIndex]};
      const items = [...checklist.items];
      const itemIndex = items.findIndex(item => item.itemID === action.itemID);
      items[itemIndex].title = action.title;
      checklist.items = items;
      checklists[checklistIndex] = checklist;
      card.checklists = checklists;
      list.cards[cardIndex] = card;
      lists[listIndex] = list;
      return { ...state, lists, currentCard: card };
    }
    case actionTypes.DELETE_CHECKLIST_ITEM: {
      const lists = [...state.lists];
      const listIndex = lists.findIndex(list => list.listID === action.listID);
      const list = { ...lists[listIndex] };
      const cardIndex = list.cards.findIndex(card => card.cardID === action.cardID);
      const card = { ...list.cards[cardIndex] };
      const checklists = [...card.checklists];
      const checklistIndex = checklists.findIndex(checklist => checklist.checklistID === action.checklistID);
      const checklist = {...checklists[checklistIndex]};
      const items = [...checklist.items];
      const itemIndex = items.findIndex(item => item.itemID === action.itemID);
      items.splice(itemIndex, 1);
      checklist.items = items;
      checklists[checklistIndex] = checklist;
      card.checklists = checklists;
      list.cards[cardIndex] = card;
      lists[listIndex] = list;
      return { ...state, lists, currentCard: card };
    }
    case actionTypes.MOVE_LIST: {
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
    }
    case actionTypes.MOVE_CARD_SAME_LIST: {
      const lists = [...state.lists];
      const listIndex = lists.findIndex(list => list.listID === action.listID);
      const list = { ...lists[listIndex] };
      const cards = [...list.cards];
      const card = cards.splice(action.sourceIndex, 1)[0];
      cards.splice(action.destIndex, 0, card);
      list.cards = cards;
      lists[listIndex] = list;
      return { ...state, lists };
    }
    case actionTypes.MOVE_CARD_DIFF_LIST: {
      const lists = [...state.lists];
      const sourceIndex = lists.findIndex(list => list.listID === action.sourceID);
      const destIndex = lists.findIndex(list => list.listID === action.destID);
      const sourceList = { ...lists[sourceIndex] };
      const destList = { ...lists[destIndex] };
      const sourceCards = [...sourceList.cards];
      const card = { ...sourceCards[action.sourceIndex], listID: action.destID };
      sourceCards.splice(action.sourceIndex, 1);
      const destCards = [...destList.cards];
      destCards.splice(action.destIndex, 0, card);
      sourceList.cards = sourceCards;
      destList.cards = destCards;
      lists[sourceIndex] = sourceList;
      lists[destIndex] = destList;
      return { ...state, lists };
    }
    case actionTypes.COPY_CARD: {
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
      const newCard = { title: action.title, desc: '', checklists, dueDate: null, cardID: action.newCardID };
      newCard.labels = action.keepLabels ? [...action.currentCard.labels] : [];
      cards.splice(action.destIndex, 0, newCard);
      list.cards = cards;
      lists[listIndex] = list;
      return { ...state, lists };
    }
    default: return state;
  }
};

export default reducer;
