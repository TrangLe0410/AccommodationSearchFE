import React, { memo, useEffect, useState } from 'react'
import { Select, InputReadOnly, InputFormV2 } from '../components'
import { apiGetPublicProvinces, apiGetPublicDistrict, apiGetPublicWards } from '../services'
import { useSelector } from 'react-redux'

const Address = ({ setPayload, invalidFields, setInvalidFields, isEdit }) => {
    const { dataEdit } = useSelector(state => state.post)
    const [provinces, setProvinces] = useState([])
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([]);
    const [province, setProvince] = useState('')
    const [district, setDistrict] = useState('')
    const [ward, setWard] = useState('')
    const [reset, setReset] = useState(false)
    const [inputAddress, setInputAddress] = useState('')



    useEffect(() => {
        if (isEdit && dataEdit) {
            let addressArr = dataEdit?.address?.split(',');
            setInputAddress({ address: addressArr[0]?.trim() }); // Lấy phần đầu tiên của địa chỉ để hiển thị trong InputFormV2
        }
    }, [dataEdit, isEdit]);

    useEffect(() => {
        if (provinces.length > 0) {
            const daNangProvince = provinces.find(item => item.province_name === 'Thành phố Đà Nẵng');
            if (daNangProvince) {
                setProvince(daNangProvince.province_id);
            }
        }
    }, [provinces]);

    useEffect(() => {
        if (isEdit && dataEdit) {
            let addressArr = dataEdit?.address?.split(',');
            let foundDistrict = districts?.length > 0 && districts?.find(item => item.district_name === addressArr[addressArr.length - 2]?.trim());
            setDistrict(foundDistrict ? foundDistrict.district_id : '');
        }
    }, [districts, dataEdit, isEdit]);

    useEffect(() => {
        if (isEdit && dataEdit) {
            let addressArr = dataEdit?.address?.split(',');
            let foundWard = wards?.length > 0 && wards?.find(item => item.ward_name === addressArr[addressArr.length - 3]?.trim());
            setWard(foundWard ? foundWard.ward_id : '');
        }
    }, [wards, dataEdit, isEdit]);

    useEffect(() => {
        const fetchPublicProvince = async () => {
            const response = await apiGetPublicProvinces();
            if (response.status === 200) {
                setProvinces(response?.data.results);

                // Tìm tỉnh/thành phố Đà Nẵng và đặt nó làm giá trị mặc định cho province
                const daNangProvince = response?.data.results.find(item => item.province_name === 'Thành phố Đà Nẵng');
                if (daNangProvince) {
                    setProvince(daNangProvince.province_id);
                }
            }
        }
        fetchPublicProvince();
    }, []);

    useEffect(() => {
        setDistrict('')
        const fetchPublicDistrict = async () => {
            const response = await apiGetPublicDistrict(province)
            if (response.status === 200) {
                setDistricts(response.data?.results)
            }
        }
        province && fetchPublicDistrict()
        !province ? setReset(true) : setReset(false)
        !province && setDistricts([])
    }, [province])
    useEffect(() => {
        setWards([]); // Xóa danh sách phường/xã hiện tại
        const fetchPublicWard = async () => {
            try {
                const response = await apiGetPublicWards(district); // Gọi API để lấy danh sách phường/xã
                setWards(response); // Cập nhật danh sách phường/xã
            } catch (error) {
                console.error("Error fetching wards:", error);
            }
        };
        district && fetchPublicWard(); // Gọi fetchPublicWard() khi district thay đổi
        !district && setWards([]); // Nếu không có district được chọn, đặt danh sách phường/xã về trạng thái ban đầu
    }, [district]);


    useEffect(() => {
        setPayload(prev => ({
            ...prev,
            address: `${inputAddress.address}, ${wards?.find(item => item.ward_id === ward)?.ward_name}, ${districts?.find(item => item.district_id === district)?.district_name}, ${provinces?.find(item => item.province_id === province)?.province_name}`,
            province: provinces?.find(item => item.province_id === province)?.province_name
        }))
    }, [inputAddress, province, district, provinces, districts, ward, wards, setPayload])

    return (
        <div>
            <h2 className='font-semibold text-xl py-4'>Địa chỉ cho thuê</h2>
            <div className='flex flex-col gap-4'>
                <div className='flex items-center gap-4'>
                    <Select
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        type='province'
                        value={province}
                        setValue={setProvince}
                        options={provinces}
                        label='Tỉnh/Thành phố'
                    />
                    <Select
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        reset={reset}
                        type='district'
                        value={district}
                        setValue={setDistrict}
                        options={districts}
                        label='Quận/Huyện' />
                    <Select
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        reset={reset}
                        type='ward'
                        value={ward}
                        setValue={setWard}
                        options={wards}
                        label='Phường/Xã' />
                </div>
                <InputFormV2
                    setValue={setInputAddress}
                    name='address'
                    label='Địa chỉ nhà'
                    invalidFields={invalidFields}
                    setInvalidFields={setInvalidFields} />
                <InputReadOnly
                    label='Địa chỉ chính xác'
                    value={`${inputAddress.address ? inputAddress.address + ', ' : ''}${wards?.find(item => item.ward_id === ward)?.ward_name || ''}${ward ? ', ' : ''}${districts?.find(item => item.district_id === district)?.district_name || ''}${district ? ', ' : ''}${provinces?.find(item => item.province_id === province)?.province_name || ''}`}
                />

            </div>
        </div>
    )
}

export default memo(Address)