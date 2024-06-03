import axiosConfig from '../axiosConfig'
import axios from 'axios'
export const apiGetPosts = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/post/all',
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})

export const apiGetPostsLimit = (query) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/post/limit`,
            params: query
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})


export const apiGetNewPosts = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/post/new-post`,
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})

export const apiUploadImages = (images) => new Promise(async (resolve, reject) => {
    console.log('Request Headers:', axios.defaults.headers);
    try {
        const response = await axios({
            method: 'post',

            url: `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`,


            data: images,
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})

export const apiCreatePost = (payload) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: `/api/v1/post/create-new`,
            data: payload
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})

export const apiGetPostsLimitAdmin = (query) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/post/limit-admin`,
            params: query
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})
export const apiUpdatePost = (payload) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'put',
            url: `/api/v1/post/update-post`,
            data: payload
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})

export const apiDeletePost = (postId) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'delete',
            url: `/api/v1/post/delete-post`,
            params: { postId }
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})

export const apiApprovePost = (postId) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'put',
            url: `/api/v1/post/approve-post`, // Đường dẫn API duyệt bài đăng
            data: { postId }
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})

export const apiCancelPost = (postId) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'put',
            url: `/api/v1/post/cancel-post`, // Đường dẫn API duyệt bài đăng
            data: { postId }
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})

export const apiGetPostsByStar = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/post/by-star`,
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})
export const apiGetRelatedPosts = (postId) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/post/related-posts`,
            params: { postId }
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

export const apiCalculateAverageRent = (postId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: 'get',
                url: '/api/v1/statistical/average-rent',
                params: { postId } // Truyền postId vào query parameters
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
};

export const apiCalculateAverageRentByAllProvince = (postId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: 'get',
                url: '/api/v1/statistical/average-rent-by-all-province',
                params: { postId } // Truyền postId vào query parameters
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
};

export const apiCalculateAverageRentByProvinceAndDate = (postId, year) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: 'get',
                url: '/api/v1/statistical/calculate-average-rent-by-province-and-date',
                params: { postId, year } // Truyền postId và year vào query parameters
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
};

export const apiMarkPost = (postId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: 'post',
                url: '/api/v1/post/mark-post',
                data: { postId, userId }
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
};


export const apiGetMarkedPosts = async (userId) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/post/get-marked-posts?userId=${userId}`,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updatePostStarsService = (payload) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: `/api/v1/post/updateStar`,
            data: payload
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})

export const apiHidePost = (postId) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'put',
            url: `/api/v1/post/hide-post?postId=${postId}`, // Đường dẫn API duyệt bài đăng
            data: { postId }
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})

export const apiVisiblePost = (postId) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'put',
            url: `/api/v1/post//visible-post?postId=${postId}`, // Đường dẫn API duyệt bài đăng
            data: { postId }
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})