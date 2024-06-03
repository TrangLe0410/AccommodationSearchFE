import axiosConfig from '../axiosConfig';


export const apiSendMessage = (conversationId, userId, message) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: 'post',
                url: '/api/v1/messages/sendMessage',
                data: {
                    conversationId, userId, message
                },
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
};
export const getMessageByRoom = async (conversationId) => {
    try {
        const response = await axiosConfig.get(`/api/v1/messages/get-messages-by-room?conversationId=${conversationId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getMessageLastedByRoom = async (conversationId) => {
    try {
        const response = await axiosConfig.get(`/api/v1/messages/get-latest-message-by-room?conversationId=${conversationId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getUnreadMessagesCount = async (conversationId) => {
    try {
        const response = await axiosConfig.get(`/api/v1/messages/unread-messages?conversationId=${conversationId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getTotalUnreadMessagesCount = async () => {
    try {
        const response = await axiosConfig.get(`/api/v1/messages/total-unread-messages-for-user`);
        return response.data;
    } catch (error) {
        throw error;
    }
};




