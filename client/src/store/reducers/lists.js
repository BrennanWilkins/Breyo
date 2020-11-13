import * as actionTypes from '../actions/actionTypes';
const Entities = require('entities');

const initialState = {
  lists: [],
  shownCardID: null,
  shownListID: null,
  currentCard: null,
  currentListTitle: null,
  archivedCards: [],
  archivedLists: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_ACTIVE_BOARD: {
      let archivedCards = [];
      let lists = action.payload.lists.map(list => {
        const cards = list.cards.map(card => ({
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
          desc: Entities.decode(card.desc),
          isArchived: card.isArchived,
          members: card.members,
          comments: card.comments.map(comment => ({
            email: comment.email,
            fullName: comment.fullName,
            cardID: comment.cardID,
            listID: comment.listID,
            date: comment.date,
            commentID: comment._id,
            msg: Entities.decode(comment.msg)
          })).sort((a,b) => new Date(b.date) - new Date(a.date))
        }));
        if (!list.isArchived) {
          archivedCards = archivedCards.concat(cards.filter(card => card.isArchived).map(card => ({ ...card, listID: list._id })));
        }
        return {
          indexInBoard: list.indexInBoard,
          listID: list._id,
          title: Entities.decode(list.title),
          isArchived: list.isArchived,
          cards: cards.filter(card => !card.isArchived)
        };
      }).sort((a,b) => a.indexInBoard - b.indexInBoard);
      const archivedLists = lists.filter(list => list.isArchived);
      lists = lists.filter(list => !list.isArchived);
      return { ...state, lists, archivedCards, archivedLists };
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
      cards.push({ title: action.title, desc: '', checklists: [], dueDate: null, labels: [], cardID: action.cardID, isArchived: false, members: [], comments: [] });
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
    case actionTypes.EDIT_CHECKLIST_TITLE: {
      const lists = [...state.lists];
      const listIndex = lists.findIndex(list => list.listID === action.listID);
      const list = { ...lists[listIndex] };
      const cardIndex = list.cards.findIndex(card => card.cardID === action.cardID);
      const card = { ...list.cards[cardIndex] };
      const checklists = [...card.checklists];
      const checklistIndex = checklists.findIndex(checklist => checklist.checklistID === action.checklistID);
      const checklist = { ...checklists[checklistIndex] };
      checklist.title = action.title;
      checklists[checklistIndex] = checklist;
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
      const newCard = { title: action.title, desc: '', checklists, dueDate: null, cardID: action.newCardID, isArchived: false, members: [], comments: [] };
      newCard.labels = action.keepLabels ? [...action.currentCard.labels] : [];
      cards.splice(action.destIndex, 0, newCard);
      list.cards = cards;
      lists[listIndex] = list;
      return { ...state, lists };
    }
    case actionTypes.ARCHIVE_CARD: {
      const lists = [...state.lists];
      const listIndex = lists.findIndex(list => list.listID === action.listID);
      const list = { ...lists[listIndex] };
      const cardIndex = list.cards.findIndex(card => card.cardID === action.cardID);
      const cards = [...list.cards];
      const card = cards.splice(cardIndex, 1)[0];
      list.cards = cards;
      lists[listIndex] = list;
      const archivedCards = [...state.archivedCards];
      archivedCards.push({ ...card, listID: action.listID, isArchived: true });
      return { ...state, lists, archivedCards };
    }
    case actionTypes.RECOVER_CARD: {
      const lists = [...state.lists];
      const listIndex = lists.findIndex(list => list.listID === action.listID);
      const list = { ...lists[listIndex] };
      const archivedCards = [...state.archivedCards];
      const cardIndex = archivedCards.findIndex(card => card.cardID === action.cardID);
      const card = archivedCards.splice(cardIndex, 1)[0];
      delete card.listID;
      const cards = [...list.cards];
      cards.push({ ...card, isArchived: false });
      list.cards = cards;
      lists[listIndex] = list;
      return { ...state, lists, archivedCards };
    }
    case actionTypes.DELETE_CARD: {
      const archivedCards = [...state.archivedCards];
      const cardIndex = archivedCards.findIndex(card => card.cardID === action.cardID);
      archivedCards.splice(cardIndex, 1);
      return { ...state, archivedCards };
    }
    case actionTypes.COPY_LIST: {
      const lists = [...state.lists];
      const newList = {
        indexInBoard: action.newList.indexInBoard,
        listID: action.newList._id,
        title: Entities.decode(action.newList.title),
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
          title: Entities.decode(card.title),
          desc: Entities.decode(card.desc),
          isArchived: false
        }))
      };
      lists.push(newList);
      return { ...state, lists };
    }
    case actionTypes.ARCHIVE_LIST: {
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
      // remove any archived cards in the archived list since they will be archived too
      const archivedCards = state.archivedCards.filter(card => card.listID !== archivedList.listID);
      return { ...state, lists, archivedLists, archivedCards };
    }
    case actionTypes.RECOVER_LIST: {
      const lists = [...state.lists];
      const archivedLists = [...state.archivedLists];
      const listIndex = archivedLists.findIndex(list => list.listID === action.listID);
      const archivedList = { ...archivedLists.splice(listIndex, 1)[0] };
      archivedList.isArchived = false;
      archivedList.indexInBoard = lists.length;
      lists.push(archivedList);
      return { ...state, lists, archivedLists };
    }
    case actionTypes.DELETE_LIST: {
      const archivedLists = [...state.archivedLists];
      const listIndex = archivedLists.findIndex(list => list.listID === action.listID);
      archivedLists.splice(listIndex, 1);
      return { ...state, archivedLists };
    }
    case actionTypes.ARCHIVE_ALL_CARDS: {
      const lists = [...state.lists];
      const listIndex = lists.findIndex(list => list.listID === action.listID);
      const list = { ...lists[listIndex] };
      const archivedCards = state.archivedCards.concat(list.cards.map(card => ({ ...card, listID: list.listID, isArchived: true })));
      list.cards = [];
      lists[listIndex] = list;
      return { ...state, lists, archivedCards };
    }
    case actionTypes.MOVE_ALL_CARDS: {
      const lists = [...state.lists];
      const oldListIndex = lists.findIndex(list => list.listID === action.oldListID);
      const newListIndex = lists.findIndex(list => list.listID === action.newListID);
      const oldList = { ...lists[oldListIndex] };
      const newList = { ...lists[newListIndex] };
      newList.cards = newList.cards.concat([...oldList.cards]);
      oldList.cards = [];
      lists[oldListIndex] = oldList;
      lists[newListIndex] = newList;
      return { ...state, lists };
    }
    case actionTypes.ADD_CARD_MEMBER: {
      const lists = [...state.lists];
      const listIndex = lists.findIndex(list => list.listID === action.listID);
      const list = { ...lists[listIndex] };
      const cards = [...list.cards];
      const cardIndex = cards.findIndex(card => card.cardID === action.cardID);
      const card = { ...cards[cardIndex] };
      card.members = [...card.members, { email: action.email, fullName: action.fullName }];
      cards[cardIndex] = card;
      list.cards = cards;
      lists[listIndex] = list;
      return { ...state, lists, currentCard: card };
    }
    case actionTypes.REMOVE_CARD_MEMBER: {
      const lists = [...state.lists];
      const listIndex = lists.findIndex(list => list.listID === action.listID);
      const list = { ...lists[listIndex] };
      const cards = [...list.cards];
      const cardIndex = cards.findIndex(card => card.cardID === action.cardID);
      const card = { ...cards[cardIndex] };
      card.members = card.members.filter(member => member.email !== action.email);
      cards[cardIndex] = card;
      list.cards = cards;
      lists[listIndex] = list;
      return { ...state, lists, currentCard: card };
    }
    case actionTypes.ADD_COMMENT: {
      const lists = [...state.lists];
      const listIndex = lists.findIndex(list => list.listID === action.payload.listID);
      const list = { ...lists[listIndex] };
      const cards = [...list.cards];
      const cardIndex = cards.findIndex(card => card.cardID === action.payload.cardID);
      const card = { ...cards[cardIndex] };
      const comments = [...card.comments];
      comments.unshift({ ...action.payload });
      card.comments = comments;
      cards[cardIndex] = card;
      list.cards = cards;
      lists[listIndex] = list;
      return { ...state, lists, currentCard: card };
    }
    case actionTypes.UPDATE_COMMENT: {
      const lists = [...state.lists];
      const listIndex = lists.findIndex(list => list.listID === action.listID);
      const list = { ...lists[listIndex] };
      const cards = [...list.cards];
      const cardIndex = cards.findIndex(card => card.cardID === action.cardID);
      const card = { ...cards[cardIndex] };
      const comments = [...card.comments];
      const commentIndex = comments.findIndex(comment => comment.commentID === action.commentID);
      const comment = { ...comments[commentIndex] };
      comment.msg = action.msg;
      comments[commentIndex] = comment;
      card.comments = comments;
      cards[cardIndex] = card;
      list.cards = cards;
      lists[listIndex] = list;
      return { ...state, lists, currentCard: card };
    }
    case actionTypes.DELETE_COMMENT: {
      const lists = [...state.lists];
      const listIndex = lists.findIndex(list => list.listID === action.listID);
      const list = { ...lists[listIndex] };
      const cards = [...list.cards];
      const cardIndex = cards.findIndex(card => card.cardID === action.cardID);
      const card = { ...cards[cardIndex] };
      const comments = [...card.comments];
      const commentIndex = comments.findIndex(comment => comment.commentID === action.commentID);
      comments.splice(commentIndex, 1);
      card.comments = comments;
      cards[cardIndex] = card;
      list.cards = cards;
      lists[listIndex] = list;
      return { ...state, lists, currentCard: card };
    }
    default: return state;
  }
};

export default reducer;
