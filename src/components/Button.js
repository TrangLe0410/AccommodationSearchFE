import React, { memo } from 'react'



const Button = ({ text, textColor, textFont, bgColor, onClick, px, fullWidth, border, width, IcAfter, hover }) => {
    return (
        <button
            type='button'
            className={`py-2 ${px ? px : 'px-2'} ${textColor} ${textFont} ${bgColor} ${fullWidth && 'w-full'} ${width} flex items-center justify-center outline-none rounded-md text-base ${border} 
            border-solid ${hover} border-[#00B98E]  h-[40px] gap-1`}
            onClick={onClick}
        >
            <span> {text}</span>
            {IcAfter && <span>{<IcAfter />}</span>}

        </button>
    )
}

export default memo(Button)