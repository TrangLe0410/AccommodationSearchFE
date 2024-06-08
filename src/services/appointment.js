import axios from 'axios';
import axiosConfig from '../axiosConfig'

export const createNewAppointment = (formData) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: `/api/v1/appointment/create-appointment`,
            data: formData
        });


        resolve(response);

    } catch (error) {
        reject(error);
    }
});

export const deleteAppointment = (appointmentId) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'delete',
            url: `/api/v1/appointment/delete-appointment`,
            params: { appointmentId: appointmentId }
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});
export const getAppointmentsByRequesterID = async (appointmentRequesterID) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/appointment/getAppointmentsByRequester?appointmentRequesterID=${appointmentRequesterID}`,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const getAppointmentsByPoster = async (posterId) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/appointment/getAppointmentsByPoster?posterId=${posterId}`,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const apiGetAppointmentById = async (appointmentId) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/appointment/getAppointmentById?appointmentId=${appointmentId}`,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const apiApproveAppointment = (appointmentId) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'put',
            url: `/api/v1/appointment/approve-appointment?appointmentId=${appointmentId}`, // Đường dẫn API duyệt bài đăng

        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})
export const apiCancelAppointment = (appointmentId) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'put',
            url: `/api/v1/appointment/cancel-appointment?appointmentId=${appointmentId}`, // Đường dẫn API duyệt bài đăng

        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})
