
import actionTypes from './actionTypes'
import { fetchUnreadNotificationCount } from '../../services/notification';

export const fetchUnreadNotification = () => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.FETCH_TOTAL_UNREAD_NOTIFICATION_REQUEST });

        try {
            const response = await fetchUnreadNotificationCount();
            dispatch({
                type: actionTypes.FETCH_TOTAL_UNREAD_NOTIFICATION_SUCCESS,
                payload: response.count
            });
        } catch (error) {
            dispatch({ type: actionTypes.FETCH_TOTAL_UNREAD_NOTIFICATION_FAILURE, payload: error.notification });
        }
    };
};



