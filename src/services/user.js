import axios from '../axiosConfig'
import axiosConfig from '../axiosConfig'
export const apiGetCurrent = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axios({
            method: 'get',
            url: '/api/v1/user/get-current',
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})

export const apiGetAllUser = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/user/get-all-user',
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})

export const apiUpdateProfile = async (formData) => {
    try {
        const response = await axios({
            method: 'put', // Sử dụng phương thức PUT để cập nhật thông tin
            url: '/api/v1/user/update-profile',
            data: formData, // Dữ liệu cập nhật được truyền vào từ component
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const apiGetCountUser = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/user/count-allUser',
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})


export const apiGetCountUserByMonth = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/user/count-by-moth',
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});
