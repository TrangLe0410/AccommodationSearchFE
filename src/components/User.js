import React from 'react'
import { useSelector } from 'react-redux'
import anonAvatar from '../assets/anon-avatar.png'
import icons from '../ultils/icons'
const { BiSolidBell } = icons
const User = () => {
    const { currentData } = useSelector(state => state.user)



    return (
        <div className='flex items-center gap-4'>
            <div className="tooltip">
                <div className="w-12">
                    <img
                        src={currentData?.avatar || anonAvatar}
                        alt="avatar"
                        className='w-12 object-cover rounded-full h-12 border-2 shadow-md border-white'
                    />
                </div>
                <span class="tooltiptext">Menu</span>
            </div>
            <div className='w-[100px]'>
                <span className='font-semibold'>{currentData?.name}</span>

            </div>
        </div>

    )
}

export default User