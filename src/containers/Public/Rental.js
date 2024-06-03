import React, { useState, useEffect } from 'react'
import { text } from '../../ultils/constant'
import { Province, Slider, ItemSidebar, NewPost } from "../../components"
import { List, Pagination } from './index'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { formatVietnameseToString } from '../../ultils/Common/formatVietnameseToString'

const Rental = () => {
    const { prices, areas, categories } = useSelector(state => state.app)
    const [categoryCurrent, setCategoryCurrent] = useState({})
    const [categoryCode, setCategoryCode] = useState('none')
    const location = useLocation()
    const dispatch = useDispatch()
    useEffect(() => {
        const category = categories?.find(item => `/${formatVietnameseToString(item.value)}` === location.pathname)
        console.log(category)
        setCategoryCurrent(category)
        if (category) {
            setCategoryCode(category.code)
        }
    }, [location])

    return (
        <div className='w-full flex flex-col gap-3 mt-1.5' >
            <Slider />
            <div>
                <h1 className="text-[32px] font-bold">{categoryCurrent?.header}</h1>
                <p className="text-base text-gray-700">{categoryCurrent?.subheader}</p>
            </div>
            <Province />
            <div className="w-full flex gap-5">
                <div className='w-[70%]'>
                    <List categoryCode={categoryCode} />
                    <Pagination />
                </div>
                <div className='w-[30%] flex flex-col gap-4 justify-start items-center'>
                    <div className="mb-5 w-full p-4 bg-white border border-gray-300 rounded-lg">
                        <ItemSidebar type='priceCode' isDouble={true} content={prices} title={'Xem theo giá'} />
                    </div>
                    <div className="mb-5 w-full p-4 bg-white border border-gray-300 rounded-lg">
                        <ItemSidebar type='areaCode' isDouble={true} content={areas} title={'Xem theo diện tích'} />
                    </div>
                    <div className="mb-5 w-full p-4 bg-white border border-gray-300 rounded-lg">
                        <NewPost newPost />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Rental