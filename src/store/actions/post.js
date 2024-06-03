import actionTypes from './actionTypes'
import {
    apiGetPosts, apiGetPostsLimit, apiGetNewPosts, apiGetRelatedPosts, apiGetPostsLimitAdmin,
    apiCalculateAverageRent, apiApprovePost, apiCancelPost, apiGetPostsByStar,
    apiCalculateAverageRentByProvinceAndDate, apiMarkPost, apiGetMarkedPosts,
    apiCalculateAverageRentByAllProvince
} from '../../services/post'

export const getPosts = () => async (dispatch) => {
    try {
        const response = await apiGetPosts()

        if (response?.data.err === 0) {
            dispatch({
                type: actionTypes.GET_POSTS,
                posts: response.data.response
            })
        } else {
            dispatch({
                type: actionTypes.GET_POSTS,
                msg: response.data.msg
            })
        }

    } catch (error) {
        dispatch({
            type: actionTypes.GET_POSTS,
            posts: null
        })
    }
}

export const getPostsLimit = (query) => async (dispatch) => {
    try {
        const response = await apiGetPostsLimit(query)

        if (response?.data.err === 0) {
            dispatch({
                type: actionTypes.GET_POSTS_LIMIT,
                posts: response.data.response?.rows,
                count: response.data.response?.count
            })
        } else {
            dispatch({
                type: actionTypes.GET_POSTS_LIMIT,
                msg: response.data.msg
            })
        }

    } catch (error) {
        dispatch({
            type: actionTypes.GET_POSTS_LIMIT,
            posts: null
        })
    }
}
export const getNewPosts = () => async (dispatch) => {
    try {
        const response = await apiGetNewPosts()
        if (response?.data.err === 0) {
            dispatch({
                type: actionTypes.GET_NEW_POST,
                newPosts: response.data.response,
            })
        } else {
            dispatch({
                type: actionTypes.GET_NEW_POST,
                msg: response.data.msg,
                newPosts: null
            })
        }

    } catch (error) {
        dispatch({
            type: actionTypes.GET_NEW_POST,
            newPosts: null
        })
    }
}

export const getPostsLimitAdmin = (query) => async (dispatch) => {
    try {
        const response = await apiGetPostsLimitAdmin(query)
        if (response?.data.err === 0) {
            dispatch({
                type: actionTypes.GET_POSTS_ADMIN,
                posts: response.data.response?.rows,
                count: response.data.response?.count
            })
        } else {
            dispatch({
                type: actionTypes.GET_POSTS_ADMIN,
                msg: response.data.msg,
                posts: null
            })
        }

    } catch (error) {
        dispatch({
            type: actionTypes.GET_POSTS_LIMIT,
            posts: null
        })
    }
}

export const editData = (dataEdit) => ({
    type: actionTypes.EDIT_POST,
    dataEdit
})

export const resetDataEdit = () => ({
    type: actionTypes.RESET_DATAEDIT_POST
})

export const approvePost = (postId) => async (dispatch) => {
    try {
        const response = await apiApprovePost(postId); // Call the API
        if (response?.data.err === 0) {
            dispatch({
                type: actionTypes.APPROVE_POST_SUCCESS,
                postId
            });
        } else {
            dispatch({
                type: actionTypes.APPROVE_POST_FAILURE,
                msg: response.data.msg
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.APPROVE_POST_FAILURE,
            msg: 'Failed to approve post'
        });
    }
};

export const cancelPost = (postId) => async (dispatch) => {
    try {
        const response = await apiCancelPost(postId); // Call the API
        if (response?.data.err === 0) {
            dispatch({
                type: actionTypes.CANCEL_POST_SUCCESS,
                postId
            });
        } else {
            dispatch({
                type: actionTypes.CANCEL_POST_FAILURE,
                msg: response.data.msg
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.CANCEL_POST_FAILURE,
            msg: 'Failed to cancel post'
        });
    }
};

export const getPostsByStar = () => async (dispatch) => {
    try {
        const response = await apiGetPostsByStar();
        if (response?.data.err === 0) {
            // Lấy 5 bài đăng đầu tiên từ danh sách các bài đăng có sao cao nhất
            const starPosts = response.data.response.slice(0, 5);
            dispatch({
                type: actionTypes.GET_POST_BY_START,
                starPosts,
            });
        } else {
            dispatch({
                type: actionTypes.GET_POST_BY_START,
                msg: response.data.msg,
                starPosts: null
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.GET_POST_BY_START,
            starPosts: null
        });
    }
};
export const getRelatedPosts = (postId) => async (dispatch) => {
    try {
        const response = await apiGetRelatedPosts(postId);

        if (response?.data.err === 0) {
            dispatch({
                type: actionTypes.GET_RELATED_POSTS,
                relatedPosts: response.data.relatedPosts // Gửi toàn bộ mảng relatedPosts về reducer
            });
        } else {
            dispatch({
                type: actionTypes.GET_RELATED_POSTS_FAILURE,
                msg: response.data.msg,
                relatedPosts: null
            });
        }
    } catch (error) {
        console.error('Error in getRelatedPosts action:', error);
        dispatch({
            type: actionTypes.GET_RELATED_POSTS_FAILURE,
            msg: 'Failed to get related posts'
        });
    }
};

export const clearPosts = () => ({
    type: 'CLEAR_POSTS',
});

export const calculateAverageRent = (postId) => async (dispatch) => {
    try {
        const response = await apiCalculateAverageRent(postId);
        if (response?.data.err === 0) {
            dispatch({
                type: actionTypes.CALCULATE_AVERAGE_RENT_SUCCESS,
                averageRent: response.data.averageRent
            });
        } else {
            dispatch({
                type: actionTypes.CALCULATE_AVERAGE_RENT_FAILURE,
                msg: response.data.msg
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.CALCULATE_AVERAGE_RENT_FAILURE,
            msg: 'Failed to calculate average rent: ' + error.message
        });
    }
};


export const calculateAverageRentByAllProvince = (postId) => async (dispatch) => {
    try {
        const response = await apiCalculateAverageRentByAllProvince(postId);
        if (response?.data.err === 0) {
            dispatch({
                type: actionTypes.CALCULATE_AVERAGE_RENT_BY_ALL_PROVINCE_SUCCESS,
                averageRentByAllProvince: response.data.averageRents // Chỉnh sửa key này để phù hợp với dữ liệu trả về từ API
            });
        } else {
            dispatch({
                type: actionTypes.CALCULATE_AVERAGE_RENT_BY_ALL_PROVINCE_FAILURE,
                msg: response.data.msg
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.CALCULATE_AVERAGE_RENT_BY_ALL_PROVINCE_FAILURE,
            msg: 'Failed to calculate average rent: ' + error.message
        });
    }
};
export const calculateAverageRentByProvinceAndDate = (postId, year) => async (dispatch) => {
    try {
        const response = await apiCalculateAverageRentByProvinceAndDate(postId, year);
        if (response?.data.err === 0) {
            dispatch({
                type: actionTypes.CALCULATE_AVERAGE_RENT_BY_PROVINCE_AND_DATE_SUCCESS,
                averageRentByDate: response.data.averageRentByMonth // Chỉnh sửa key này để phù hợp với dữ liệu trả về từ API
            });
        } else {
            dispatch({
                type: actionTypes.CALCULATE_AVERAGE_RENT_BY_PROVINCE_AND_DATE_FAILURE,
                msg: response.data.msg
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.CALCULATE_AVERAGE_RENT_BY_PROVINCE_AND_DATE_FAILURE,
            msg: 'Failed to calculate average rent: ' + error.message
        });
    }
};


export const markPost = (postId, userId) => async (dispatch) => {
    try {
        // Gọi hàm API để đánh dấu bài đăng
        const response = await apiMarkPost(postId, userId);

        if (response?.data.err === 0) {
            // Nếu không có lỗi, cập nhật trạng thái hoặc thực hiện các hành động khác tùy thuộc vào ứng dụng của bạn
            console.log('Bài đăng đã được đánh dấu thành công');
        } else {
            // Nếu có lỗi, xử lý lỗi hoặc hiển thị thông báo lỗi tương ứng
            console.error('Lỗi khi đánh dấu bài đăng:', response.data.msg);
        }
    } catch (error) {
        // Xử lý lỗi trong trường hợp không thể gửi yêu cầu
        console.error('Lỗi khi gọi API đánh dấu bài đăng:', error);
    }
};

export const getMarkedPosts = (userId) => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.GET_MARKED_POSTS });
        try {
            const markedPosts = await apiGetMarkedPosts(userId);
            dispatch({ type: actionTypes.GET_MARKED_POSTS_SUCCESS, payload: markedPosts });
        } catch (error) {
            dispatch({ type: actionTypes.GET_MARKED_POSTS_FAILURE, error: error.message });
        }
    };
};

