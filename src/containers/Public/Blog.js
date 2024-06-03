import React from "react"
import { Link } from "react-router-dom";
import icons from '../../ultils/icons'
const { FiSearch } = icons
const Blog = () => {
    return (
        <div className="w-full">
            <img src="https://content-writing-india.com/blog/wp-content/uploads/2018/03/1080px.jpg" alt="imageBlog" className="w-full h-[400px] object-cover" />
            <div className="search mt-4 flex items-center justify-center">
                <div className='p-[10px] w-3/4 my-3 bg-[#febb02] rounded-lg flex-col lg:flex-row flex items-center justify-center  gap-2' >
                    <input
                        type="text"
                        className="flex-1 outline-none py-2 px-4 rounded-md text-base placeholder-gray-500"
                        placeholder="Nhập nội dung cần tìm kiếm..."
                    />

                    <button
                        type='button'
                        className='w-1/4 outline-none py-2 px-4 rounded-md bg-[#0071c2] text-base flex items-center justify-center gap-2 text-white font-medium hover:shadow-lg'
                    >
                        <FiSearch />
                        Tìm kiếm
                    </button>
                </div>
            </div>
            <div className='w-full flex gap-3 mt-1.5' >
                <div class="w-[70%] flex flex-col mt-5 p-12 items-start bg-white shadow-sm border border-gray-200 rounded-lg ">
                    <div className='flex items-center justify-between'>
                        <h4 className='text-3xl font-semibold'> Tin tức</h4>
                    </div>
                    <div className='flex items-center gap-2 my-2'>
                        <span className='text-sm'>Sắp xếp: </span>
                        <span className="bg-gray-200 p-2 rounded-md cursor-pointer hover:underline">Mặc định</span>
                        <span className="bg-gray-200 p-2 rounded-md cursor-pointer hover:underline" >Mới nhất</span>
                    </div>

                    <div class="flex  mt-4 border-t border-gray-500  py-5">
                        <img src="https://img4.thuthuatphanmem.vn/uploads/2020/12/25/hinh-anh-nha-biet-thu-2-tang_115818035.png" alt="Image" class="w-1/4 mr-4 object-cover rounded-sm" />
                        <div class="flex  mx-4 flex-col">
                            <Link to={`/tin-tuc-chi-tiet`} className="text-blue-600 font-bold text-2xl mb-2 hover:underline cursor-pointer">Tailwind Rocks!</Link>
                            <p class="my-3  text-justify">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eius eaque a ipsam aliquid omnis,
                                beatae possimus recusandae illum rem. Minima sequi voluptas repudiandae id? Quae, facere quam suscipit sed,
                                aperiam sapiente pariatur soluta enim perferendis illum veniam excepturi doloribus ducimus voluptatibus
                                numquam officiis expedita culpa hic sequi quasi reprehenderit iste obcaecati nostrum. Consequuntur aliquam,
                                assumenda architecto animi veniam dolore dolor?</p>
                        </div>
                    </div>

                    <div class="flex  mt-4 border-t border-gray-500  py-5">
                        <img src="https://img4.thuthuatphanmem.vn/uploads/2020/12/25/hinh-anh-nha-biet-thu-2-tang_115818035.png" alt="Image" class="w-1/4 mr-4 object-cover rounded-sm" />
                        <div class="flex  mx-4 flex-col">
                            <Link to={`/tin-tuc-chi-tiet`} className="text-blue-600 font-bold text-2xl mb-2 hover:underline cursor-pointer">Tailwind Rocks!</Link>
                            <p class="my-3  text-justify">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eius eaque a ipsam aliquid omnis,
                                beatae possimus recusandae illum rem. Minima sequi voluptas repudiandae id? Quae, facere quam suscipit sed,
                                aperiam sapiente pariatur soluta enim perferendis illum veniam excepturi doloribus ducimus voluptatibus
                                numquam officiis expedita culpa hic sequi quasi reprehenderit iste obcaecati nostrum. Consequuntur aliquam,
                                assumenda architecto animi veniam dolore dolor?</p>
                        </div>
                    </div>
                </div>
                <div class="w-[30%] mt-5 p-3 bg-white border shadow-sm border-gray-200 rounded-lg">
                    item 1

                </div>

            </div>


        </div>
    )
}

export default Blog