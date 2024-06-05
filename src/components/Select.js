import React, { memo } from 'react';

const Select = ({ label, options, value, setValue, type, reset, name, invalidFields, setInvalidFields, disabled }) => {
    const handleErrorText = () => {
        let textError = '';
        let nameInvalid = invalidFields?.find(item => item.name === name);
        let addressInvalid = invalidFields?.find(item => item.name === 'address');
        return `${nameInvalid ? nameInvalid.message : ''}` || `${addressInvalid ? addressInvalid.message : ''}`;
    };

    return (
        <div className='flex flex-col gap-2 flex-1'>
            <label className='font-medium' htmlFor="select-address">{label}</label>
            <select
                defaultValue={reset ? '' : value} // Use defaultValue instead of value
                onChange={(e) => !name ? setValue(e.target.value) : setValue(prev => ({ ...prev, [name]: e.target.value }))}
                id={`select-${type}`}
                className='outline-none border border-gray-300 p-2 rounded-md w-full'
                onFocus={() => setInvalidFields([])}
                disabled={disabled}
            >
                <option value="">{`--Chọn ${label}--`}</option>
                {options?.map(item => (
                    <option
                        key={type === 'province' ? item.idProvince : type === 'district' ? item.idDistrict : type === 'ward' ? item.idCommune : item.code}
                        value={type === 'province' ? item.idProvince : type === 'district' ? item.idDistrict : type === 'ward' ? item.idCommune : item.code}
                        selected={value === (type === 'province' ? item.idProvince : type === 'district' ? item.idDistrict : type === 'ward' ? item.idCommune : item.code)}
                    >
                        {type === 'province' ? item.name : type === 'district' ? item.name : type === 'ward' ? item.name : item.value}
                    </option>
                ))}
            </select>
            {invalidFields && <small className='text-red-500'>
                {handleErrorText()}
            </small>}
        </div>
    );
};

export default memo(Select);
