import React, { useState } from 'react'
import { useLocation, NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import icons from '../../ultils/icons'
import anonAvatar from '../../assets/anon-avatar.png'
import * as actions from '../../store/actions'
import menuSidebar from '../../ultils/menuSidebar'
import { CiMoneyBill } from "react-icons/ci";
const { IoExitOutline } = icons

const activeStyle = 'hover:bg-gray-200 flex rounded-md items-center gap-4 py-2 font-bold bg-gray-200'
const notActiveStyle = 'hover:bg-gray-200 flex rounded-md items-center gap-4 py-2 cursor-pointer'
const subItemStyle = 'flex rounded-md items-center gap-4 py-2 pl-4 cursor-pointer hover:bg-gray-200'
const subItemActiveStyle = 'hover:bg-gray-200 flex rounded-md items-center gap-4 py-2 pl-4 cursor-pointer font-bold bg-gray-200'

const Sidebar = () => {
    const dispatch = useDispatch()
    const { currentData } = useSelector(state => state.user)
    const [expandedItems, setExpandedItems] = useState({})
    const location = useLocation()

    const handleToggle = (itemId) => {
        setExpandedItems(prevState => ({
            ...prevState,
            [itemId]: !prevState[itemId]
        }))
    }

    const isActive = (path) => {
        return location.pathname === path;
    }
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/he-thong/nap-tien');
    };




    return (
        <div className='w-[256px] flex-none p-4 flex flex-col gap-6'>
            <div className='flex flex-col gap-4'>
                <div className='flex items-center gap-4'>
                    <img src={currentData?.avatar || anonAvatar} alt="avatar" className='w-12 h-12 object-cover rounded-full border-2 border-white' />


                    <div className='flex flex-col justify-center'>
                        <span className='font-semibold'>{currentData?.name}</span>
                        <small>{currentData?.phone}</small>
                    </div>
                </div>
                <span>Mã thành viên: <small className='font-medium'>{currentData?.id?.match(/\d/g).join('')?.slice(0, 6)}</small></span>
                <div className='flex items-center gap-4'>
                    <div className='flex gap-1 items-center'>
                        <p >Số dư: </p>
                        <p className='font-bold text-green-600'>{currentData?.balance}đ</p>
                    </div>
                    <button
                        className='w-[70px] mt-[-10px] rounded-sm text-center items-center border border-yellow-500 bg-yellow-400'
                        onClick={handleClick}
                    >
                        <p>Nạp tiền</p>
                    </button>
                </div>

            </div>
            <div>
                {menuSidebar.map(item => (
                    <div key={item.id}>
                        <div onClick={() => handleToggle(item.id)}>
                            <NavLink
                                className={isActive(item.path) ? activeStyle : notActiveStyle}
                                to={item.path}
                            >
                                {item.icon}
                                {item.text}
                            </NavLink>
                        </div>
                        {item.subItems && expandedItems[item.id] && (
                            <div className='pl-4'>
                                {item.subItems.map(subItem => (
                                    <NavLink
                                        key={subItem.id}
                                        className={isActive(subItem.path) ? subItemActiveStyle : subItemStyle}
                                        to={subItem.path}
                                    >
                                        {subItem.icon}
                                        {subItem.text}
                                    </NavLink>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                <span onClick={() => dispatch(actions.logout())} className={notActiveStyle}><IoExitOutline color='#1345aa' />Thoát</span>
            </div>
        </div>
    )
}

export default Sidebar
