import React, { useState, useEffect } from 'react'
import { ItemSidebar, NewPost } from '../../components'
import { List, Pagination } from './index'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

const SearchDetail = () => {
    const { prices, areas } = useSelector(state => state.app)
    const location = useLocation()

    return (
        <div className='w-full  text-base flex flex-col gap-3' >

            <div className='flex items-start gap-6' style={{ lineHeight: '1.5' }}>

                <h1 className='text-[28px] font-bold' style={{ wordWrap: 'break-word', maxWidth: '760px', }}>
                    {location.state?.titleSearch || 'Kết quả tìm kiếm'}
                </h1>

            </div>

            <div className='w-full flex gap-4'>
                <div className='w-[70%]'>
                    <List />
                    <Pagination />
                </div>
                <div className='w-[30%] flex flex-col gap-4 justify-start items-center'>
                    <ItemSidebar isDouble={true} type='priceCode' content={prices} title='Xem theo giá' />
                    <ItemSidebar isDouble={true} type='areaCode' content={areas} title='Xem theo diện tích' />
                    <NewPost />
                </div>
            </div>

        </div>
    )
}

export default SearchDetail