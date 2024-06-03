import actionTypes from "../actions/actionTypes";

const initialState = {

    messagesByRoom: [],
    messagesLastedByRoom: [],
    messageList: [],
    loading: false,
    error: null,
    totalUnreadMessages: 0,
    conversationByUser: [],

};

const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_MESSAGES_BY_ROOM_SUCCESS:
            return {
                ...state,
                messagesByRoom: action.payload,
                error: null,
            };
        case actionTypes.FETCH_MESSAGES_BY_ROOM_FAILURE:
            return {
                ...state,
                messagesByRoom: [],
                error: action.payload,
            };

        case actionTypes.FETCH_MESSAGES_LASTED_BY_ROOM_SUCCESS:
            return {
                ...state,
                messagesLastedByRoom: action.payload,
                error: null,
            };
        case actionTypes.FETCH_MESSAGES_LASTED_BY_ROOM_FAILURE:
            return {
                ...state,
                messagesLastedByRoom: [],
                error: action.payload,
            };
        case 'ADD_MESSAGE_TO_ROOM':
            return {
                ...state,
                messagesByRoom: [...state.messagesByRoom, action.payload]
            };

        case actionTypes.FETCH_TOTAL_UNREAD_MESSAGES_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case actionTypes.FETCH_TOTAL_UNREAD_MESSAGES_SUCCESS:
            return {
                ...state,
                loading: false,
                totalUnreadMessages: action.payload,
                error: null
            };
        case actionTypes.FETCH_TOTAL_UNREAD_MESSAGES_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case 'SET_TOTAL_UNREAD_MESSAGES':
            return {
                ...state,
                totalUnreadMessages: action.payload,
            };

        default:
            return state;
    }
};

export default messageReducer;