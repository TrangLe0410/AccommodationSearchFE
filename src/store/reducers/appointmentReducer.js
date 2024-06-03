import actionTypes from "../actions/actionTypes";

const initialState = {
    appointmentRequesters: [],
    isSameUser: false,
    appointmentsPosters: [],
    appointment: [],
};

const appointmentReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_APPOINTMENTS_REQUEST:
            return {
                ...state,
            };
        case actionTypes.FETCH_APPOINTMENTS_SUCCESS:
            return {
                ...state,
                appointmentRequesters: action.payload,
            };
        case actionTypes.FETCH_APPOINTMENTS_FAILURE:
            return {
                ...state,
            };
        case actionTypes.FETCH_APPOINTMENTS_POSTER_REQUEST:
            return {
                ...state,
            };
        case actionTypes.FETCH_APPOINTMENTS_POSTER_SUCCESS:
            return {
                ...state,
                appointmentsPosters: action.payload,
            };
        case actionTypes.FETCH_APPOINTMENTS_POSTER_FAILURE:
            return {
                ...state,
            };
        case actionTypes.GET_APPOINTMENTS_BYID_REQUEST:
            return {
                ...state,
            };
        case actionTypes.GET_APPOINTMENTS_BYID_SUCCESS:
            return {
                ...state,
                appointment: action.payload,
            };
        case actionTypes.GET_APPOINTMENTS_BYID_FAILURE:
            return {
                ...state,
                appointment: null,
            };
        case actionTypes.CANCEL_APPOINTMENTS_SUCCESS:
            // Tìm bài đăng trong danh sách và cập nhật trạng thái
            const updatedAppointmentsAfterCancel = state.appointmentsPosters.map(appointment => {
                if (appointment.id === action.appointmentId) {
                    return {
                        ...appointment,
                        status: 'Canceled' // Đặt trạng thái là 'Canceled' sau khi hủy
                    };
                }
                return appointment;
            });
            return {
                ...state,
                appointmentsPosters: updatedAppointmentsAfterCancel
            };
        case actionTypes.APPROVE_APPOINTMENTS_SUCCESS:
            // Tìm bài đăng trong danh sách và cập nhật trạng thái
            const updatedAppointmentsAfterApprove = state.appointmentsPosters.map(appointment => {
                if (appointment.id === action.appointmentId) {
                    return {
                        ...appointment,
                        status: 'Approved' // Đặt trạng thái là 'Approved' sau khi duyệt
                    };
                }
                return appointment;
            });
            return {
                ...state,
                appointmentsPosters: updatedAppointmentsAfterApprove
            };
        case actionTypes.APPROVE_APPOINTMENTS_FAILURE:
        case actionTypes.CANCEL_APPOINTMENTS_FAILURE:
            return {
                ...state,
                msg: action.msg || 'Failed to update appointment status'
            };

        default:
            return state;
    }
};

export default appointmentReducer;
