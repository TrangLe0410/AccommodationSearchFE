import axiosConfig from '../axiosConfig';


export const fetchUserNotifications = async () => {
    try {
        const response = await axiosConfig.get(`/api/v1/notification/get-notification`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchUnreadNotificationCount = async () => {
    try {
        const response = await axiosConfig.get(`/api/v1/notification/unread-notification-count`);
        return response.data;
    } catch (error) {
        throw error;
    }
};


