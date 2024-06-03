import React, { memo } from 'react';
import moment from 'moment';
import 'moment/locale/vi';
import { Link } from 'react-router-dom';
import { formatVietnameseToString } from '../ultils/Common/formatVietnameseToString';
import icons from '../ultils/icons'
import { path } from '../ultils/constant'
const defaultImage = 'https://www.shutterstock.com/image-vector/landscape-photo-image-picture-placeholder-600nw-272872412.jpg';
const { GrStar } = icons
const Sitem = ({ title, price, image, createdAt, id, star }) => {

    const formatTime = (createdAt) => {
        return moment(createdAt).fromNow();
    }
    const handleStar = (star) => {
        let stars = [];
        for (let i = 1; i <= +star; i++) stars.push(<GrStar className="star-item" style={{ color: '#fbbf24' }} size={20} />);
        return stars;
    };

    return (
        <div className='w-full flex items-center gap-2 py-2 border-b border-gray-300'>
            <img
                src={image && image[0] ? image[0] : defaultImage}
                alt="anh"
                className='w-[65px] h-[65px] object-cover flex-none rounded-md'
            />
            <div className='w-full flex-auto flex flex-col justify-between gap-1'>
                <Link to={`${path.DETAIL}${formatVietnameseToString(title?.replaceAll('/', ''))}/${id}`}>
                    <h4 className='text-[#0E2E50] text-sm'>
                        {handleStar(+star).length > 0 && handleStar(+star).map((star, number) => {
                            return (
                                <span key={number}>{star}</span>
                            )
                        })}
                        {`${title?.slice(0, 45)}...`}
                    </h4>
                </Link>

                <div className=' flex items-center justify-between w-full'>
                    <span className='text-sm font-bold text-green-500'>{price}</span>
                    <span className='text-sm text-gray-300'>{formatTime(createdAt)}</span>
                </div>
            </div>
        </div>
    );
}

export default memo(Sitem);
