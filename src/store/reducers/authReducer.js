import actionTypes from "../actions/actionTypes"

const initState = {
    isLoggedIn: false,
    isRegister: false,
    token: null,
    msg: '',
    role: '' // Thêm trường role vào initState
}

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.REGISTER_SUCCESS:
            return {
                ...state,
                isRegister: true,
                token: action.data,
                msg: ''
            }
        case actionTypes.LOGIN_SUCCESS:
            const { token, role } = action.data
            return {
                ...state,
                isLoggedIn: true,
                token,
                role,
                msg: ''
            }
        case actionTypes.LOGIN_FAIL:
            return {
                ...state,
                msg: action.msg || 'Failed to log in'
            };
        case actionTypes.REGISTER_FAIL:
            return {
                ...state,
                isRegister: false,
                msg: action.data,
                token: null,
                update: !state.update

            }
        case actionTypes.LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                token: null,
                role: '', // Đăng xuất cũng đặt lại vai trò thành rỗng
                msg: ''
            }
        default:
            return state
    }
}

export default authReducer