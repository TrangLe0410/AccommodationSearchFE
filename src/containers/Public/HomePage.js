import React, { useEffect } from "react"
import { text } from "../../ultils/constant"
import { Province, Slider, ItemSidebar, NewPost, ChatContent } from "../../components"
import { Search, List, Pagination, Chat } from "./index"
import { useDispatch, useSelector } from "react-redux"
import * as actions from '../../store/actions'
import { useSearchParams } from "react-router-dom"
const Homepage = () => {
    const { categories, prices, areas } = useSelector(state => state.app)
    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(actions.getCategories())
    }, [])

    return (
        <div className='w-full flex flex-col gap-3 mt-1.5' >
            <div class="flex justify-between gap-10 items-center">
                <div class="max-w-[45%]">
                    <div className="flex flex-col">
                        <h1 className="text-4xl font-bold display-5 animated fadeIn mb-4 text-[#00B98E]" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Luffy Land <span className="text-[#0E2E50]">Trải Nghiệm Tìm Trọ Dễ Dàng và Thuận Tiện</span>
                        </h1>
                    </div>

                    <p class="text-base text-[#666565] text-justify">{text.HOME_DESCRIPTION}</p>
                </div>
                <div class="w-[55%]">
                    <Slider />
                </div>
            </div>
            <Search />

            <Province />
            <div className="w-full flex gap-5">
                <div className='w-[70%]' >
                    <List />
                    <Pagination />
                </div>
                <div className='w-[30%] flex flex-col justify-start items-center'>
                    <div className="mb-5 w-full p-4 text-[#0E2E50] bg-white border border-gray-300 shadow-sm rounded-md">
                        <ItemSidebar content={categories} title={'Danh mục cho thuê'} />
                    </div>
                    <div className="mb-5 w-full p-4 text-[#0E2E50] bg-white border border-gray-300 rounded-lg">
                        <ItemSidebar type='priceCode' isDouble={true} content={prices} title={'Xem theo giá'} />
                    </div>
                    <div className="mb-5 w-full p-4 text-[#0E2E50] bg-white border border-gray-300 rounded-lg">
                        <ItemSidebar type='areaCode' isDouble={true} content={areas} title={'Xem theo diện tích'} />
                    </div>
                    <div className="mb-5 w-full p-4 text-[#0E2E50] bg-white border border-gray-300 rounded-lg">
                        <NewPost newPost />
                    </div>

                </div>

            </div>


        </div>
    )
}

export default Homepage