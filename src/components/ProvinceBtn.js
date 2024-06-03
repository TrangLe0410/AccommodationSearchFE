import React, { memo } from 'react'

const ProvinceBtn = ({ name, image, onClick }) => {
    return (
        <div className='shadow-md rounded-bl-md text-[#0E2E50] rounded-br-md cursor-pointer hover:text-[#00B98E] transition duration-300 transform hover:scale-110'
            onClick={onClick}>
            <img
                src={image}
                alt={name}
                className='w-[220px] h-[140px] object-cover rounded-tl-md rounded-tr-md'
            />
            <div className='font-medium p-2 text-base text-center'>{name}</div>
        </div>
    );
};

export default memo(ProvinceBtn);