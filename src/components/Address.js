import React, { memo, useEffect, useState } from 'react';
import { Select, InputReadOnly, InputFormV2 } from '../components';
import { apiGetPublicProvinces, apiGetPublicDistrict, apiGetPublicWards } from '../services';
import { useSelector } from 'react-redux';

const Address = ({ setPayload, invalidFields, setInvalidFields, isEdit }) => {
    const { dataEdit } = useSelector(state => state.post);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');
    const [reset, setReset] = useState(false);
    const [inputAddress, setInputAddress] = useState('');

    useEffect(() => {
        if (isEdit && dataEdit) {
            const addressArr = dataEdit?.address?.split(',');
            setInputAddress({ address: addressArr[0]?.trim() });

            const provinceName = addressArr[addressArr.length - 1]?.trim();
            const districtName = addressArr[addressArr.length - 2]?.trim();
            const wardName = addressArr[addressArr.length - 3]?.trim();

            const province = provinces.find(item => item.name === provinceName);
            if (province) setProvince(province.idProvince);

            const district = districts.find(item => item.name === districtName);
            if (district) setDistrict(district.idDistrict);

            const ward = wards.find(item => item.name === wardName);
            if (ward) setWard(ward.idCommune);
        }
    }, [dataEdit, isEdit, provinces, districts, wards]);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await apiGetPublicProvinces();
                if (response) {
                    setProvinces(response);
                    const defaultProvince = response.find(item => item.name === 'Thành phố Đà Nẵng');
                    if (defaultProvince) setProvince(defaultProvince.idProvince);
                }
            } catch (error) {
                console.error("Error fetching provinces:", error);
            }
        };
        fetchProvinces();
    }, []);

    useEffect(() => {
        const fetchDistricts = async () => {
            try {
                const response = await apiGetPublicDistrict(province);
                if (response) {
                    setDistricts(response);
                }
            } catch (error) {
                console.error("Error fetching districts:", error);
            }
        };
        if (province) fetchDistricts();
        else {
            setReset(true);
            setDistricts([]);
        }
    }, [province]);

    useEffect(() => {
        const fetchWards = async () => {
            try {
                const response = await apiGetPublicWards(district);
                if (response) {
                    setWards(response);
                }
            } catch (error) {
                console.error("Error fetching wards:", error);
            }
        };
        if (district) fetchWards();
        else setWards([]);
    }, [district]);

    useEffect(() => {
        setPayload(prev => ({
            ...prev,
            address: `${inputAddress.address ? inputAddress.address + ', ' : ''}${wards.find(item => item.idCommune === ward)?.name || ''}, ${districts.find(item => item.idDistrict === district)?.name || ''}, ${provinces.find(item => item.idProvince === province)?.name || ''}`,
            province: provinces.find(item => item.idProvince === province)?.name
        }));
    }, [inputAddress, province, district, provinces, districts, ward, wards, setPayload]);

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
                        label='Quận/Huyện'
                    />
                    <Select
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        reset={reset}
                        type='ward'
                        value={ward}
                        setValue={setWard}
                        options={wards}
                        label='Phường/Xã'
                    />
                </div>
                <InputFormV2
                    setValue={setInputAddress}
                    name='address'
                    label='Địa chỉ nhà'
                    invalidFields={invalidFields}
                    setInvalidFields={setInvalidFields}
                />
                <InputReadOnly
                    label='Địa chỉ chính xác'
                    value={`${inputAddress.address ? inputAddress.address + ', ' : ''}${wards.find(item => item.idCommune === ward)?.name || ''}${ward ? ', ' : ''}${districts.find(item => item.idDistrict === district)?.name || ''}${district ? ', ' : ''}${provinces.find(item => item.idProvince === province)?.name || ''}`}
                />
            </div>
        </div>
    );
};

export default memo(Address);
