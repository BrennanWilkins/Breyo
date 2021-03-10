const routes = [
  'put/board/title',
  'put/board/color',
  'put/board/desc',
  'post/board/admins',
  'delete/board/admins',
  'put/list/moveList',
  'put/card/moveCard/sameList',
  'put/card/moveCard/diffList',
  'put/list/title',
  'post/list',
  'post/list/copy',
  'post/list/archive',
  'put/list/archive/recover',
  'delete/list/archive',
  'put/list/archive/allCards',
  'put/list/moveAllCards',
  'post/card',
  'put/card/title',
  'put/card/desc',
  'post/card/label',
  'put/card/label/remove',
  'put/card/dueDate/isComplete',
  'post/card/dueDate',
  'delete/card/dueDate',
  'post/card/checklist',
  'delete/card/checklist',
  'put/card/checklist/title',
  'post/card/checklist/item',
  'put/card/checklist/item/isComplete',
  'put/card/checklist/item/title',
  'put/card/checklist/item/delete',
  'post/card/copy',
  'post/card/archive',
  'put/card/archive/recover',
  'delete/card/archive',
  'post/card/members',
  'delete/card/members',
  'post/card/comments',
  'put/card/comments',
  'delete/card/comments',
  'post/activity',
  'put/activity/board/deleteCard',
  'put/activity/board/deleteList',
  'delete/activity',
  'post/board/newMember',
  'put/board/memberLeft',
  'delete/card/roadmapLabel',
  'post/card/roadmapLabel',
  'delete/board',
  'put/card/checklist/moveItem',
  'put/board/changeTeam',
  'put/card/comments/like',
  'post/card/customField',
  'put/card/customField/title',
  'put/card/customField/value',
  'delete/card/customField',
  'post/list/voting',
  'post/card/vote',
  'put/list/limit',
  'delete/list/limit',
  'put/card/customField/move',
  'put/list/sort',
  'post/board/customLabel',
  'put/board/customLabel',
  'delete/board/customLabel',
  'post/card/customLabel',
  'delete/card/customLabel',
  'put/board/removeFromTeam'
];

module.exports = routes;