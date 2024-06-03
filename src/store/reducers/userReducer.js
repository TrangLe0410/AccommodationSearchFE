import actionTypes from "../actions/actionTypes";

const initState = {
    currentData: {},
    users: [],
}

const userReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.GET_CURRENT:
            return {
                ...state,
                currentData: action.currentData || {}
            }
        case actionTypes.LOGOUT:
            return {
                ...state,
                currentData: {}
            }
        case actionTypes.GET_ALL_USER:
            return {
                ...state,
                users: action.users || [],
                msg: action.msg || '',
            }


        default:
            return state;
    }
}

export default userReducer