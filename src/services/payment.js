import axiosConfig from '../axiosConfig'

export const apiGetTransactionHistory = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/payment/transaction-history', // URL API lấy lịch sử giao dịch
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});
