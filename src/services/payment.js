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

export const apiPaymentAccountBalance = async (paymentData) => {
    try {
        const response = await axiosConfig.post('/api/v1/payment/payment-account-balance', paymentData);
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : 'Error processing payment');
    }
};

export const apiGetPaymentHistory = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/payment/payment-history', // URL API lấy lịch sử giao dịch
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});

export const apiGetAllPaymentHistory = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/payment/all-payment-history', // URL API lấy lịch sử giao dịch
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});