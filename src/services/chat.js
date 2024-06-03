import axiosConfig from '../axiosConfig';


export const createNewChatRoom = (user1Id, user2Id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: 'post',
                url: '/api/v1/conversations',
                data: {
                    user1Id,
                    user2Id
                },
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
};

export const getUserConversations = async () => {
    try {
        const response = await axiosConfig.get('/api/v1/conversations/room-chat');
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const getUserConversationByUser = async () => {
    try {
        const response = await axiosConfig.get('/api/v1/conversations/room-chat-by-user');
        return response.data;
    } catch (error) {
        throw error;
    }
};