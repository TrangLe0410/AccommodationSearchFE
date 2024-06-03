import actionTypes from "../actions/actionTypes";

const initialState = {
    count: 0,

};

const notificationReducer = (state = initialState, action) => {
    switch (action.type) {


        case actionTypes.FETCH_TOTAL_UNREAD_NOTIFICATION_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case actionTypes.FETCH_TOTAL_UNREAD_NOTIFICATION_SUCCESS:
            return {
                ...state,
                loading: false,
                count: action.payload,
                error: null
            };
        case actionTypes.FETCH_TOTAL_UNREAD_NOTIFICATION_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };


        default:
            return state;
    }
};

export default notificationReducer;