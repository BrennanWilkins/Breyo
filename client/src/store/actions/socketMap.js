import * as actionTypes from './actionTypes';

// map of socket type to respective actionType
const socketMap = {
  'put/board/title': actionTypes.UPDATE_BOARD_TITLE,
  'put/board/color': actionTypes.UPDATE_COLOR,
  'put/board/desc': actionTypes.UPDATE_BOARD_DESC,
  'put/list/moveList': actionTypes.MOVE_LIST,
  'put/card/moveCard/sameList': actionTypes.MOVE_CARD_SAME_LIST,
  'put/card/moveCard/diffList': actionTypes.MOVE_CARD_DIFF_LIST,
  'put/list/title': actionTypes.UPDATE_LIST_TITLE,
  'post/list': actionTypes.ADD_LIST,
  'post/list/copy': actionTypes.COPY_LIST,
  'post/list/archive': actionTypes.ARCHIVE_LIST,
  'put/list/archive/recover': actionTypes.RECOVER_LIST,
  'put/list/archive/delete': actionTypes.DELETE_LIST,
  'put/list/archive/allCards': actionTypes.ARCHIVE_ALL_CARDS,
  'put/list/moveAllCards': actionTypes.MOVE_ALL_CARDS,
  'post/card': actionTypes.ADD_CARD,
  'put/card/title': actionTypes.UPDATE_CARD_TITLE,
  'put/card/label/add': actionTypes.ADD_CARD_LABEL,
  'put/card/label/remove': actionTypes.REMOVE_CARD_LABEL,
  'put/card/dueDate/isComplete': actionTypes.TOGGLE_DUE_DATE,
  'post/card/dueDate': actionTypes.ADD_DUE_DATE,
  'put/card/dueDate/remove': actionTypes.REMOVE_DUE_DATE,
  'post/card/checklist': actionTypes.ADD_CHECKLIST,
  'put/card/checklist/delete': actionTypes.DELETE_CHECKLIST,
  'put/card/checklist/title': actionTypes.EDIT_CHECKLIST_TITLE,
  'post/card/checklist/item': actionTypes.ADD_CHECKLIST_ITEM,
  'put/card/checklist/item/isComplete': actionTypes.TOGGLE_CHECKLIST_ITEM,
  'put/card/checklist/item/title': actionTypes.EDIT_CHECKLIST_ITEM,
  'put/card/checklist/item/delete': actionTypes.DELETE_CHECKLIST_ITEM,
  'post/card/copy': actionTypes.COPY_CARD,
  'post/card/archive': actionTypes.ARCHIVE_CARD,
  'put/card/archive/recover': actionTypes.RECOVER_CARD,
  'put/card/archive/delete': actionTypes.DELETE_CARD,
  'post/card/members': actionTypes.ADD_CARD_MEMBER,
  'put/card/members/remove': actionTypes.REMOVE_CARD_MEMBER,
  'put/card/comments': actionTypes.UPDATE_COMMENT,
  'put/card/comments/delete': actionTypes.DELETE_COMMENT,
  'put/card/archive/restore': actionTypes.RESTORE_ARCHIVED_CARDS
};

export default socketMap;
