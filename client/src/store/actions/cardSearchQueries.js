import * as actionTypes from './actionTypes';

export const addTitleSearchQuery = title => ({ type: actionTypes.ADD_TITLE_SEARCH_QUERY, title });

export const addDueDateSearchQuery = query => ({ type: actionTypes.ADD_DUE_DATE_SEARCH_QUERY, query });

export const addMemberSearchQuery = email => ({ type: actionTypes.ADD_MEMBER_SEARCH_QUERY, email });

export const addLabelSearchQuery = label => ({ type: actionTypes.ADD_LABEL_SEARCH_QUERY, label });

export const addCustomLabelSearchQuery = labelID => ({ type: actionTypes.ADD_CUSTOM_LABEL_SEARCH_QUERY, labelID });

export const resetSearchQuery = () => ({ type: actionTypes.RESET_SEARCH_QUERY });
