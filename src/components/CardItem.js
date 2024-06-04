import React from 'react';
import { Link } from 'react-router-dom'
import icons from "../ultils/icons"
import moment from 'moment';
import 'moment/locale/vi';
import { path } from '../ultils/constant'
import { formatVietnameseToString } from '../ultils/Common/formatVietnameseToString';
const defaultImage = 'https://www.shutterstock.com/image-vector/landscape-photo-image-picture-placeholder-600nw-272872412.jpg';
const { FaRegClock, MdStarRate, MdLocationPin, MdAttachMoney, RiCrop2Line } = icons
const CardItem = ({ address, title, price, acreage, star, description, image, createdAt, id }) => {
    const formatTime = (createdAt) => {
        return moment(createdAt).fromNow();
    }

    return (
        <div class="w-[260px] bg-white border border-gray-200 rounded-lg shadow dark:text-white dark:border-white">
            <Link style={{ display: 'inline-block', overflow: 'hidden', position: 'relative' }}>
                <img className='border border-gray-200 rounded-lg object-cover' style={{ transition: 'transform 0.3s ease', width: '260px', height: '150px' }} src={image && image[0] ? image[0] : defaultImage} alt=""
                    onMouseOver={(event) => { event.target.style.transform = 'scale(1.1)' }}
                    onMouseOut={(event) => { event.target.style.transform = 'scale(1)' }} />
            </Link>

            <div>
                <div className='p-2'>
                    <Link to={`${path.DETAIL}${formatVietnameseToString(title?.replaceAll('/', ''))}/${id}`}>
                        <h5 class=" text-lg font-bold text-justify h-[40px] tracking-tight text-[#0E2E50] hover:text-[#009472] whitespace-nowrap overflow-hidden text-ellipsis">{title}</h5>
                    </Link>

                    <span className="flex items-center font-bold text-[#E03C31] text-base">
                        <MdAttachMoney style={{ color: '#00B98E', fontSize: '18px' }} />
                        {price}
                    </span>


                    <span className='flex items-center font-bold whitespace-nowrap text-[#0E2E50] overflow-hidden text-ellipsis'>
                        <MdLocationPin style={{ color: '#00B98E', fontSize: '18px' }} />
                        {`${address
                            .split(',')
                            .slice(-2)[0] // Lấy phần tử cuối cùng trong mảng
                            .trim()}`} {/* Loại bỏ khoảng trắng dư thừa */}
                    </span>

                    <p class="text-[#666565] mt-1 text-justify text-base w-full h-[50px] text-ellipsis overflow-hidden">{description} </p>

                </div>

                <div class="flex mt-2" style={{ borderTop: '1px dashed rgba(0, 185, 142, 0.3)' }}>
                    <div className="flex-grow flex items-center py-2 text-[#0E2E50] border-r border-dashed border-[rgba(0, 185, 142, 0.3)]">
                        <div className='flex text-sm items-center gap-3 ml-[5px] '>
                            <RiCrop2Line style={{ color: '#00B98E', fontSize: '18px' }} />
                            <span className='text-sm'>{acreage}</span>
                        </div>
                    </div>
                    <div className="flex-grow flex items-center py-2 text-[#0E2E50] border-r border-dashed border-[rgba(0, 185, 142, 0.3)] ">
                        <div className='flex items-center gap-3 ml-[5px]'>
                            <FaRegClock style={{ color: '#00B98E', fontSize: '18px' }} />
                            <span className='text-sm'>{formatTime(createdAt)}</span>
                        </div>
                    </div>
                    <div className="flex-grow flex items-center py-2 text-[#0E2E50]">
                        <div className='flex text-sm items-center gap-2 ml-[5px]'>
                            <span className='text-sm'>{star}</span>
                            <MdStarRate style={{ color: '#fbbf24', fontSize: '20px' }} />
                        </div>
                    </div>
                </div>


            </div>
        </div >

    );
};

export default CardItem;
