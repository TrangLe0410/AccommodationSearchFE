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
        case actionTypes.LOCK_USER:
            return {
                ...state,
                users: state.users.map(user =>
                    user.id === action.payload ? { ...user, status: 'locked' } : user
                ),
            };
        case actionTypes.UNLOCK_USER:
            return {
                ...state,
                users: state.users.map(user =>
                    user.id === action.payload ? { ...user, status: 'active' } : user
                ),
            };
        case actionTypes.SET_USERS:
            return {
                ...state,
                users: action.payload,
            };


        default:
            return state;
    }
}

export default userReducer