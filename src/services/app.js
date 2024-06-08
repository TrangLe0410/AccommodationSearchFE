import axios from '../axiosConfig'
import axiosDefault from 'axios'

export const apiGetPrices = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axios({
            method: 'get',
            url: '/api/v1/price/all'
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
export const apiGetAreas = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axios({
            method: 'get',
            url: '/api/v1/area/all'
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
export const apiGetProvinces = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axios({
            method: 'get',
            url: '/api/v1/province/all'
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiGetPublicProvinces = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axios({
            method: 'get',
            url: '/api/v1/province/provinces'
        })
        resolve(response.data)
    } catch (error) {
        reject(error)
    }
})
export const apiGetPublicDistrict = (provinceId) => new Promise(async (resolve, reject) => {
    try {
        const response = await axios({
            method: 'get',
            url: `/api/v1/province/districts/${provinceId}`
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
})

export const apiGetPublicWards = (districtId) => new Promise(async (resolve, reject) => {
    try {
        const response = await axios({
            method: 'get',
            url: `/api/v1/province/communes/${districtId}`
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
})

export const apiCreateCheckoutSession = (selectedAmount) => new Promise(async (resolve, reject) => {
    try {
        const response = await axios.post('/api/v1/payment/create-checkout-session', {
            price: selectedAmount
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});