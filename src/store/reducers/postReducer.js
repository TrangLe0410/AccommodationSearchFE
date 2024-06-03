import actionTypes from "../actions/actionTypes";

const initState = {
    posts: [],
    msg: '',
    count: 0,
    newPosts: [],
    postId: null,
    postDetails: [],
    postOfCurrent: [],
    dataEdit: null,
    starPosts: [],
    relatedPosts: [],
    averageRent: 0,
    averageRentByDate: [],
    markedPosts: [],
    markedPostsMsg: '',
    averageRentByAllProvince: [],


}

const postReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.GET_POSTS:
        case actionTypes.GET_POSTS_LIMIT:
            return {
                ...state,
                posts: action.posts || [],
                msg: action.msg || '',
                count: action.count || 0
            }
        case actionTypes.GET_NEW_POST:
            return {
                ...state,
                msg: action.msg || '',
                newPosts: action.newPosts || []
            }

        case actionTypes.GET_POST_ID_SUCCESS:
            return {
                ...state,
                postDetails: action.postDetails || [],
                msg: action.msg || '',
                count: action.count || 0
            };
        case actionTypes.GET_POSTS_ADMIN:
            return {
                ...state,
                msg: action.msg || '',
                postOfCurrent: action.posts || []
            }
        case actionTypes.EDIT_POST:
            return {
                ...state,
                dataEdit: action.dataEdit || null
            }
        case actionTypes.RESET_DATAEDIT_POST:
            return {
                ...state,
                dataEdit: null
            }

        case actionTypes.APPROVE_POST_SUCCESS:
            // Tìm bài đăng trong danh sách và cập nhật trạng thái
            const updatedPosts = state.posts.map(post => {
                if (post.id === action.postId) {
                    return {
                        ...post,
                        status: 'Approved' // Đặt trạng thái là 'approved' sau khi duyệt
                    };
                }
                return post;
            });
            return {
                ...state,
                posts: updatedPosts
            };
        case actionTypes.APPROVE_POST_FAILURE:
            return {
                ...state,
                msg: action.msg || 'Failed to approve post'
            };
        case actionTypes.CANCEL_POST_SUCCESS:
            // Tìm bài đăng trong danh sách và cập nhật trạng thái
            const cancelPosts = state.posts.map(post => {
                if (post.id === action.postId) {
                    return {
                        ...post,
                        status: 'Canceled' // Đặt trạng thái là 'approved' sau khi duyệt
                    };
                }
                return post;
            });
            return {
                ...state,
                posts: cancelPosts
            };
        case actionTypes.CANCEL_POST_FAILURE:
            return {
                ...state,
                msg: action.msg || 'Failed to approve post'
            };
        case actionTypes.GET_POST_BY_START:
            return {
                ...state,
                msg: action.msg || '',
                starPosts: action.starPosts || []
            }
        case actionTypes.GET_RELATED_POSTS:

            return {
                ...state,
                relatedPosts: action.relatedPosts || []
            };
        case actionTypes.GET_RELATED_POSTS_FAILURE:
            return {
                ...state,
                msg: action.msg || 'Failed to get related posts',
                relatedPosts: []
            };
        case 'CLEAR_POSTS':
            return {
                ...state,
                posts: [],
            };
        case actionTypes.CALCULATE_AVERAGE_RENT_SUCCESS:
            return {
                ...state,
                averageRent: action.averageRent,
                msg: '' // Xóa thông báo lỗi nếu có
            };
        case actionTypes.CALCULATE_AVERAGE_RENT_FAILURE:
            return {
                ...state,
                averageRent: 0,
                msg: action.msg || 'Failed to calculate average rent'
            };
        case actionTypes.CALCULATE_AVERAGE_RENT_BY_PROVINCE_AND_DATE_SUCCESS:
            return {
                ...state,
                averageRentByDate: action.averageRentByDate,
                msg: '' // Clear error message if any
            };
        case actionTypes.CALCULATE_AVERAGE_RENT_BY_PROVINCE_AND_DATE_FAILURE:
            return {
                ...state,
                averageRentByDate: {}, // Chỉnh sửa giá trị mặc định nếu có lỗi
                msg: action.msg || 'Failed to calculate average rent'
            };
        case actionTypes.CALCULATE_AVERAGE_RENT_BY_ALL_PROVINCE_SUCCESS:
            return {
                ...state,
                averageRentByAllProvince: action.averageRentByAllProvince,
                msg: '' // Clear error message if any
            };
        case actionTypes.CALCULATE_AVERAGE_RENT_BY_ALL_PROVINCE_FAILURE:
            return {
                ...state,
                averageRentByAllProvince: {}, // Chỉnh sửa giá trị mặc định nếu có lỗi
                msg: action.msg || 'Failed to calculate average rent'
            };

        case actionTypes.GET_MARKED_POSTS_SUCCESS:
            return {
                ...state,
                markedPosts: action.payload,
                markedPostsMsg: ''
            };
        case actionTypes.GET_MARKED_POSTS_FAILURE:
            return {
                ...state,
                markedPosts: [],
                markedPostsMsg: action.msg
            };




        default:
            return state;
    }
}

export default postReducer;
