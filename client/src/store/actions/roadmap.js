import * as actionTypes from './actionTypes';
import { addMonths, subMonths, addDays, subDays, addHours, subHours } from 'date-fns';
import { addNotif } from './notifications';
import { instance as axios } from '../../axios';
import { addRecentActivity } from './activity';
import { sendBoardUpdate } from '../../socket/socket';

export const setRoadmapDateRange = dateRange => ({ type: actionTypes.SET_ROADMAP_DATE_RANGE, dateRange });

export const setRoadmapMode = mode => ({ type: actionTypes.SET_ROADMAP_MODE, mode });

export const resizeCardHandler = payload => async (dispatch, getState) => {
  try {
    const { oldStartDate, oldDueDate, newLeft, oldLeft, dateWidth, rangeType, newWidth, oldWidth, cardID, listID, boardID } = payload;
    let startDate = new Date(oldStartDate);
    let dueDate = new Date(oldDueDate);
    if (newLeft !== oldLeft) {
      // card start date was resized, calc days/months it was moved
      let diff = Math.round((newLeft - oldLeft) / dateWidth);
      if (diff < 0) {
        // start date was moved to the left, subtract months/days based on range type
        startDate = rangeType === 'Year' ? subMonths(startDate, Math.abs(diff)) : subDays(startDate, Math.abs(diff));
      } else {
        // start date was moved to the right, add months/days based on range type
        startDate = rangeType === 'Year' ? addMonths(startDate, Math.abs(diff)) : addDays(startDate, Math.abs(diff));
      }
    } else {
      if (oldWidth !== newWidth) {
        // card due date was resized, calc days/months it was moved
        let diff = Math.round((newWidth - oldWidth) / dateWidth);
        if (diff < 0) {
          // due date was moved to the left, subtract months/days based on range type
          dueDate = rangeType === 'Year' ? subMonths(dueDate, Math.abs(diff)) : subDays(dueDate, Math.abs(diff));
        } else {
          // due date was moved to the right, add months/days based on range type
          dueDate = rangeType === 'Year' ? addMonths(dueDate, Math.abs(diff)) : addDays(dueDate, Math.abs(diff));
        }
      }
    }
    // adjust dates if start date is now later than due date
    if (startDate > dueDate) {
      // if start date was moved to later & is now past due date, set start date 1hr before due date
      if (startDate > new Date(oldStartDate)) {
        startDate = subHours(dueDate, 1);
      } else if (dueDate < new Date(oldDueDate)) {
        // if due date was moved sooner then set due date to 1hr after start date
        dueDate = addHours(startDate, 1);
      }
    }

    const sendPayload = { startDate, dueDate, cardID, listID, boardID };
    dispatch({ type: actionTypes.ADD_DUE_DATE, ...sendPayload });
    const res = await axios.post('/card/dueDate', sendPayload);
    sendBoardUpdate('post/card/dueDate', sendPayload);
    addRecentActivity(res.data.newActivity);
  } catch (err) { dispatch(addNotif('There was an error while updating roadmap dates.')); }
};
