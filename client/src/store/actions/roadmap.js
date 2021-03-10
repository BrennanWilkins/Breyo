import * as actionTypes from './actionTypes';

export const setRoadmapDateRange = dateRange => ({ type: actionTypes.SET_ROADMAP_DATE_RANGE, dateRange });

export const setRoadmapMode = mode => ({ type: actionTypes.SET_ROADMAP_MODE, mode });
