import actionTypes from "../actions/actionTypes";

const initialState = {
    conversations: [],
    conversationByUser: [],
    loading: false,
    error: null
};

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_USER_CONVERSATIONS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case actionTypes.FETCH_USER_CONVERSATIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                conversations: action.payload,
                error: null
            };
        case actionTypes.FETCH_USER_CONVERSATIONS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case actionTypes.FETCH_USER_CONVERSATIONS_BY_USER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case actionTypes.FETCH_USER_CONVERSATIONS_BY_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                conversationByUser: action.payload,
                error: null
            };
        case actionTypes.FETCH_USER_CONVERSATIONS_BY_USER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};

export default chatReducer;