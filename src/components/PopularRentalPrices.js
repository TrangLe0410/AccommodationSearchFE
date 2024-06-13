import React, { useState, useEffect } from 'react';
import { calculateAverageRent, calculateAverageRentByAllProvince, calculateAverageRentByProvinceAndDate } from '../store/actions';
import icons from '../ultils/icons';
import { Card, CardBody } from "@material-tailwind/react";
import Chart from "react-apexcharts";
import { useDispatch, useSelector } from 'react-redux';
const { FcMoneyTransfer, FaArrowAltCircleUp } = icons;


const PopularRentalPrices = () => {
    const dispatch = useDispatch();
    const { posts, averageRent, averageRentByAllProvince } = useSelector(state => state.post);


    useEffect(() => {
        if (posts.length > 0) {
            const postId = posts[0].id;
            dispatch(calculateAverageRent(postId));
            dispatch(calculateAverageRentByAllProvince(postId));
        }
    }, [dispatch, posts]);
    console.log('averageRentByAllProvince', averageRentByAllProvince)






    return (
        <div>

            <div className='flex items-center justify-center'>
                <div className='w-full'>
                    <h3 className="font-semibold text-xl my-4 flex items-center gap-4">Giá thuê phổ biến chuyên mục:
                        <p className='text-[#E03C31]'>{posts[0]?.labelData?.value}</p>
                    </h3>
                    <div className='border flex border-gray-200 rounded-sm w-[40%] justify-between items-center mx-auto mt-6'>
                        <div className="w-full pr-2 relative">
                            <div className='justify-center items-center'>
                                <div className="pl-6 pt-1 flex items-center gap-2 text-lg text-[#E03C31] font-bold">
                                    <FcMoneyTransfer color='green' size={24} />
                                    <p className='text-lg font-bold'>{averageRent || 'Đang tải...'}</p>
                                </div>
                                <div className="pl-6 pt-1 text-gray-500">Giá thuê phổ biến nhất</div>
                            </div>

                        </div>

                    </div>
                    <h3 className="font-semibold  my-4 flex items-center gap-4">So sánh giá với các quận còn lại:</h3>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mx-auto w-[80%]">
                        <table className="w-full text-sm text-left rtl:text-right text-white bg-[#00B98E]">
                            <thead className="text-xs  uppercase bg-[#00B98E] text-white">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        <div className="flex items-center justify-center">Tên Quận</div>
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        <div className="flex items-center justify-center">Giá Thuê Phổ Biến</div>
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        <div className="flex items-center justify-center">Số Bài Đăng</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(averageRentByAllProvince).map((district, index) => (
                                    <tr key={index} className="bg-white border-b text-gray-900 ">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-black">
                                            <div className="flex items-center justify-center">{district}</div>
                                        </th>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center">{averageRentByAllProvince[district].averageRent}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center">{averageRentByAllProvince[district].postCount}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>



                </div>
            </div>


        </div>
    );
}

export default PopularRentalPrices;
