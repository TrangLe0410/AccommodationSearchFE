import axiosConfig from '../axiosConfig';

export const createNewCommentService = async (userId, postId, content, rate) => {
    try {
        const response = await axiosConfig.post('/api/v1/comment/create-comment', { userId, postId, content, rate }); // Thêm rate vào dữ liệu gửi đi
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
export const getCommentsByPostIdService = async (postId) => {
    try {
        const response = await axiosConfig.get(`/api/v1/comment/comments/${postId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};


export const deleteCommentService = async (commentId) => {
    try {
        const response = await axiosConfig.delete(`/api/v1/comment/delete-comment?commentId=${commentId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const hiddenCommentService = async (commentId) => {
    try {
        const response = await axiosConfig.put(`/api/v1/comment/hide-comment?commentId=${commentId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

