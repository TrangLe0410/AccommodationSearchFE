import actionTypes from './actionTypes'
import { apiRegister, apiLogin } from '../../services/auth'

export const register = (payload) => async (dispatch) => {
    try {
        const response = await apiRegister(payload);
        if (response?.data.err === 0) {
            dispatch({
                type: actionTypes.REGISTER_SUCCESS,
                data: response.data.token,
            });
        } else {
            dispatch({
                type: actionTypes.REGISTER_FAIL,
                data: response.data.msg,
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.REGISTER_FAIL,
            data: null,
        });
    }
};


export const login = (payload) => async (dispatch) => {
    try {
        const response = await apiLogin(payload)
        if (response?.data.err === 0) {
            const { token, role } = response.data
            dispatch({
                type: actionTypes.LOGIN_SUCCESS,
                data: { token, role }
            })
        } else {
            // Sử dụng thông báo lỗi từ response của API
            dispatch({
                type: actionTypes.LOGIN_FAIL,
                msg: response.data.msg // Lấy thông báo lỗi từ response
            })
        }
    } catch (error) {
        // Xử lý lỗi trong trường hợp gọi API không thành công
        dispatch({
            type: actionTypes.LOGIN_FAIL,
            msg: error.response.data.msg || "Đăng nhập thất bại" // Sử dụng thông báo lỗi từ API nếu có, hoặc một thông báo mặc định khác
        })
    }
}


export const logout = () => ({
    type: actionTypes.LOGOUT
})

export const resetRegister = () => ({
    type: actionTypes.RESET_REGISTER,
});