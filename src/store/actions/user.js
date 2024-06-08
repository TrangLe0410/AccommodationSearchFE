import actionTypes from './actionTypes'
import * as apis from '../../services'
import axiosConfig from '../../axiosConfig'

export const getCurrent = () => async (dispatch) => {
    try {
        const response = await apis.apiGetCurrent()
        if (response?.data.err === 0) {
            dispatch({
                type: actionTypes.GET_CURRENT,
                currentData: response.data.response
            })
        } else {
            dispatch({
                type: actionTypes.GET_CURRENT,
                msg: response.data.msg,
                currentData: null
            })
            dispatch({ type: actionTypes.LOGOUT })
        }
    } catch (error) {
        dispatch({
            type: actionTypes.GET_CURRENT,
            currentData: null,
            msg: error,
        })
        dispatch({ type: actionTypes.LOGOUT })
    }
}

export const getAllUser = () => async (dispatch) => {
    try {
        const response = await apis.apiGetAllUser()
        if (response?.data.err === 0) {
            dispatch({
                type: actionTypes.GET_ALL_USER,
                users: response.data.response
            })
        } else {
            dispatch({
                type: actionTypes.GET_ALL_USER,
                msg: response.data.msg,
                users: null
            })
        }
    } catch (error) {
        dispatch({
            type: actionTypes.GET_ALL_USER,
            categories: null
        })
    }
}

export const lockUserAccount = (userId) => async (dispatch) => {
    try {
        const response = await apis.apiLockerUser(userId);
        if (response?.data.err === 0) {
            dispatch({
                type: actionTypes.LOCK_USER,
                payload: userId,
                msg: response.data.msg
            });
        } else {
            dispatch({
                type: actionTypes.LOCK_USER_FAILURE,
                msg: response.data.msg,
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.LOCK_USER_FAILURE,
            msg: error.message,
        });
    }
};

export const unLockUserAccount = (userId) => async (dispatch) => {
    try {
        const response = await apis.apiUnLockerUser(userId);
        if (response?.data.err === 0) {
            dispatch({
                type: actionTypes.UNLOCK_USER,
                payload: userId,
                msg: response.data.msg
            });
        } else {
            dispatch({
                type: actionTypes.UNLOCK_USER_FAILURE,
                msg: response.data.msg,
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.LOCK_USER_FAILURE,
            msg: error.message,
        });
    }
};
export const setUsers = users => ({
    type: actionTypes.SET_USERS,
    payload: users,
});