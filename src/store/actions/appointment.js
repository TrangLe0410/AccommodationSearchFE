import actionTypes from './actionTypes'
import { apiConfirmAppointment, getAppointmentsByPoster, getAppointmentsByRequesterID, getAppointmentById, apiGetAppointmentById, apiApproveAppointment, apiCancelAppointment, createNewAppointment } from '../../services/appointment'


export const getNewAppointment = () => async (dispatch) => {
    try {
        const response = await createNewAppointment()
        if (response?.data.err === 0) {
            dispatch({
                type: actionTypes.GET_NEW_APPOINTMENT,
                appointmentNew: response.data.response,
            })
        } else {
            dispatch({
                type: actionTypes.GET_NEW_APPOINTMENT,
                msg: response.data.msg,
                appointmentNew: null
            })
        }

    } catch (error) {
        dispatch({
            type: actionTypes.GET_NEW_APPOINTMENT,
            newPosts: null
        })
    }
}
export const fetchAppointments = (appointmentRequesterID) => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.FETCH_APPOINTMENTS_REQUEST });
        try {
            const appointmentRequester = await getAppointmentsByRequesterID(appointmentRequesterID);
            dispatch({ type: actionTypes.FETCH_APPOINTMENTS_SUCCESS, payload: appointmentRequester });
        } catch (error) {
            dispatch({ type: actionTypes.FETCH_APPOINTMENTS_FAILURE, error: error.message });
        }
    };
};
export const fetchAppointmentsPoster = (posterId) => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.FETCH_APPOINTMENTS_POSTER_REQUEST });
        try {
            const appointmentsPoster = await getAppointmentsByPoster(posterId);
            dispatch({ type: actionTypes.FETCH_APPOINTMENTS_POSTER_SUCCESS, payload: appointmentsPoster });
        } catch (error) {
            dispatch({ type: actionTypes.FETCH_APPOINTMENTS_POSTER_FAILURE, error: error.message });
        }
    };
};

export const getAppointmentByID = (appointmentId) => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.GET_APPOINTMENTS_BYID_REQUEST });
        try {
            const appointment = await apiGetAppointmentById(appointmentId);
            dispatch({ type: actionTypes.GET_APPOINTMENTS_BYID_SUCCESS, payload: appointment });
        } catch (error) {
            dispatch({ type: actionTypes.GET_APPOINTMENTS_BYID_FAILURE, error: error.message });
        }
    };
};

export const approveAppointment = (appointmentId) => async (dispatch) => {
    try {
        const response = await apiApproveAppointment(appointmentId); // Call the API
        if (response?.data.err === 0) {
            dispatch({
                type: actionTypes.APPROVE_APPOINTMENTS_SUCCESS,
                appointmentId
            });
        } else {
            dispatch({
                type: actionTypes.APPROVE_APPOINTMENTS_FAILURE,
                msg: response.data.msg
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.APPROVE_APPOINTMENTS_FAILURE,
            msg: 'Failed to approve appointment'
        });
    }
};
export const cancelAppointment = (appointmentId) => async (dispatch) => {
    try {
        const response = await apiCancelAppointment(appointmentId); // Call the API
        if (response?.data.err === 0) {
            dispatch({
                type: actionTypes.CANCEL_APPOINTMENTS_SUCCESS,
                appointmentId
            });
        } else {
            dispatch({
                type: actionTypes.CANCEL_APPOINTMENTS_FAILURE,
                msg: response.data.msg
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.CANCEL_APPOINTMENTS_FAILURE,
            msg: 'Failed to cancel appointment'
        });
    }
};




