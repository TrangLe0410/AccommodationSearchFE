import React, { memo } from "react";

const InputForm = ({ lable, value, setValue, keyPayload, invalidFields, setInvalidFields, type }) => {
    return (
        <div>
            <lable htmlFor="phone" className="text-base">{lable}</lable>
            <input
                type={type || 'text'}
                id="phone"
                className='outline-none bg-[rgb(232,254,248)] p-2 rounded-md w-full shadow-sm'
                value={value}
                onChange={(e) => setValue(prev => ({ ...prev, [keyPayload]: e.target.value }))}
                onFocus={() => setInvalidFields([])}
            />
            {invalidFields.length > 0 && invalidFields.some(i => i.name === keyPayload) && <small className='text-red-500 italic'>{invalidFields.find(i => i.name === keyPayload)?.message}</small>}

        </div>


    );
}
export default memo(InputForm);