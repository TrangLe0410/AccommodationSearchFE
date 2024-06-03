import { getMessageByRoom, getTotalUnreadMessagesCount } from '../../services/messages';
import actionTypes from './actionTypes'


export const fetchMessagesByRoom = (conversationId) => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.FETCH_MESSAGES_BY_ROOM_REQUEST }); // Dispatch request action

        try {
            const messagesByRoom = await getMessageByRoom(conversationId); // Fetch messages by room
            dispatch({ type: actionTypes.FETCH_MESSAGES_BY_ROOM_SUCCESS, payload: messagesByRoom }); // Dispatch success action with fetched messages
        } catch (error) {
            dispatch({ type: actionTypes.FETCH_MESSAGES_BY_ROOM_FAILURE, payload: error.message }); // Dispatch failure action with error message
        }
    };
};

export const updateUnreadMessagesCount = (count) => ({
    type: 'UPDATE_UNREAD_MESSAGES',
    payload: count,
});



export const fetchMessagesLastedByRoom = (conversationId) => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.FETCH_MESSAGES_LASTED_BY_ROOM_REQUEST }); // Dispatch request action

        try {
            const messagesLastedByRoom = await getMessageByRoom(conversationId); // Fetch messages by room
            dispatch({ type: actionTypes.FETCH_MESSAGES_LASTED_BY_ROOM_SUCCESS, payload: messagesLastedByRoom }); // Dispatch success action with fetched messages
        } catch (error) {
            dispatch({ type: actionTypes.FETCH_MESSAGES_LASTED_BY_ROOM_FAILURE, payload: error.message }); // Dispatch failure action with error message
        }
    };
};

export const addMessageToRoom = (messageData) => {
    return {
        type: 'ADD_MESSAGE_TO_ROOM',
        payload: messageData
    };
};

export const fetchTotalUnreadMessages = () => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.FETCH_TOTAL_UNREAD_MESSAGES_REQUEST });

        try {
            const response = await getTotalUnreadMessagesCount();
            dispatch({
                type: actionTypes.FETCH_TOTAL_UNREAD_MESSAGES_SUCCESS,
                payload: response.totalUnreadMessages
            });
        } catch (error) {
            dispatch({ type: actionTypes.FETCH_TOTAL_UNREAD_MESSAGES_FAILURE, payload: error.message });
        }
    };
};



