import * as actionTypes from '../store/actions/actionTypes';

// map of socket type to respective actionType for board socket
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
  'delete/list/archive': actionTypes.DELETE_LIST,
  'put/list/archive/allCards': actionTypes.ARCHIVE_ALL_CARDS,
  'put/list/moveAllCards': actionTypes.MOVE_ALL_CARDS,
  'post/card': actionTypes.ADD_CARD,
  'put/card/title': actionTypes.UPDATE_CARD_TITLE,
  'put/card/desc': actionTypes.UPDATE_CARD_DESC,
  'post/card/label': actionTypes.ADD_CARD_LABEL,
  'put/card/label/remove': actionTypes.REMOVE_CARD_LABEL,
  'put/card/dueDate/isComplete': actionTypes.TOGGLE_DUE_DATE,
  'post/card/dueDate': actionTypes.ADD_DUE_DATE,
  'delete/card/dueDate': actionTypes.REMOVE_DUE_DATE,
  'post/card/checklist': actionTypes.ADD_CHECKLIST,
  'delete/card/checklist': actionTypes.DELETE_CHECKLIST,
  'put/card/checklist/title': actionTypes.EDIT_CHECKLIST_TITLE,
  'post/card/checklist/item': actionTypes.ADD_CHECKLIST_ITEM,
  'put/card/checklist/item/isComplete': actionTypes.TOGGLE_CHECKLIST_ITEM,
  'put/card/checklist/item/title': actionTypes.EDIT_CHECKLIST_ITEM,
  'put/card/checklist/item/delete': actionTypes.DELETE_CHECKLIST_ITEM,
  'post/card/copy': actionTypes.COPY_CARD,
  'post/card/archive': actionTypes.ARCHIVE_CARD,
  'put/card/archive/recover': actionTypes.RECOVER_CARD,
  'delete/card/archive': actionTypes.DELETE_CARD,
  'post/card/members': actionTypes.ADD_CARD_MEMBER,
  'delete/card/members': actionTypes.REMOVE_CARD_MEMBER,
  'post/card/comments': actionTypes.ADD_COMMENT,
  'put/card/comments': actionTypes.UPDATE_COMMENT,
  'delete/card/comments': actionTypes.DELETE_COMMENT,
  'post/activity': actionTypes.ADD_RECENT_ACTIVITY,
  'put/activity/board/deleteCard': actionTypes.UPDATE_BOARD_ACTIVITY_DELETE_CARD,
  'put/activity/board/deleteList': actionTypes.UPDATE_BOARD_ACTIVITY_DELETE_LIST,
  'delete/activity': actionTypes.DELETE_BOARD_ACTIVITY,
  'post/board/newMember': actionTypes.ADD_BOARD_MEMBER,
  'put/board/memberLeft': actionTypes.DELETE_BOARD_MEMBER,
  'put/card/checklist/moveItem': actionTypes.MOVE_CHECKLIST_ITEM,
  'put/board/changeTeam': actionTypes.CHANGE_BOARD_TEAM,
  'put/card/comments/like': actionTypes.TOGGLE_COMMENT_LIKE,
  'post/card/customField': actionTypes.ADD_CUSTOM_FIELD,
  'put/card/customField/value': actionTypes.UPDATE_CUSTOM_FIELD_VALUE,
  'delete/card/customField': actionTypes.DELETE_CUSTOM_FIELD_FROM_CARD,
  'post/board/customField': actionTypes.CREATE_CUSTOM_FIELD,
  'put/board/customField/title': actionTypes.UPDATE_CUSTOM_FIELD_TITLE,
  'put/board/customField/move': actionTypes.MOVE_CUSTOM_FIELD,
  'delete/board/customField': actionTypes.DELETE_CUSTOM_FIELD,
  'post/list/voting': actionTypes.TOGGLE_LIST_VOTING,
  'post/card/vote': actionTypes.TOGGLE_CARD_VOTE,
  'put/list/limit': actionTypes.SET_LIST_LIMIT,
  'delete/list/limit': actionTypes.REMOVE_LIST_LIMIT,
  'put/list/sort': actionTypes.SORT_LIST,
  'post/board/customLabel': actionTypes.CREATE_NEW_CUSTOM_LABEL,
  'put/board/customLabel': actionTypes.UPDATE_CUSTOM_LABEL,
  'delete/board/customLabel': actionTypes.DELETE_CUSTOM_LABEL,
  'post/card/customLabel': actionTypes.ADD_CARD_CUSTOM_LABEL,
  'delete/card/customLabel': actionTypes.DELETE_CARD_CUSTOM_LABEL,
  'put/board/removeFromTeam': actionTypes.REMOVE_BOARD_FROM_TEAM,
  'delete/board': actionTypes.DELETE_BOARD,
  'put/card/checklist/item/member': actionTypes.CHANGE_CHECKLIST_ITEM_MEMBER,
  'put/card/checklist/item/removeMember': actionTypes.REMOVE_CHECKLIST_ITEM_MEMBER,
  'put/card/checklist/item/dueDate': actionTypes.CHANGE_CHECKLIST_ITEM_DUE_DATE,
  'put/card/checklist/item/removeDueDate': actionTypes.REMOVE_CHECKLIST_ITEM_DUE_DATE
};

export default socketMap;
