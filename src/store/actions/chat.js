import actionTypes from './actionTypes'

import { getUserConversationByUser, getUserConversations } from '../../services/chat';

export const fetchUserConversations = () => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.FETCH_USER_CONVERSATIONS_REQUEST });

        try {
            const conversations = await getUserConversations(); // Fetch user conversations
            dispatch({ type: actionTypes.FETCH_USER_CONVERSATIONS_SUCCESS, payload: conversations });
        } catch (error) {
            dispatch({ type: actionTypes.FETCH_USER_CONVERSATIONS_FAILURE, payload: error.message });
        }
    };
};
export const fetchUserConversationByUser = () => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.FETCH_USER_CONVERSATIONS_BY_USER_REQUEST });

        try {
            const conversationByUser = await getUserConversationByUser(); // Fetch user conversations
            dispatch({ type: actionTypes.FETCH_USER_CONVERSATIONS_BY_USER_SUCCESS, payload: conversationByUser });
        } catch (error) {
            dispatch({ type: actionTypes.FETCH_USER_CONVERSATIONS_BY_USER_FAILURE, payload: error.message });
        }
    };
};
