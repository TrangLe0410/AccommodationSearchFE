import actionTypes from "../actions/actionTypes";

const initialState = {
    comments: [],
    error: null,
    loading: false // Thêm trạng thái loading
};

const commentReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CREATE_COMMENT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case actionTypes.CREATE_COMMENT_SUCCESS:
            return {
                ...state,
                loading: false
            };
        case actionTypes.CREATE_COMMENT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case actionTypes.GET_COMMENTS_SUCCESS:
            return {
                ...state,
                comments: action.payload, // Lưu trữ dữ liệu số sao cho mỗi comment
                error: null
            };

        case actionTypes.GET_COMMENTS_FAILURE:
            return {
                ...state,
                error: action.payload
            };

        default:
            return state;
    }
};

export default commentReducer;