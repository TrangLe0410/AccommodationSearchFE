import React, { memo, useState, useEffect } from 'react'
import icons from "../ultils/icons"
import { Link } from 'react-router-dom'
import moment from 'moment'
import 'moment/locale/vi'
import { formatVietnameseToString } from '../ultils/Common/formatVietnameseToString'
import { path } from '../ultils/constant'
import { apiMarkPost } from '../services/post'
import { useSelector, useDispatch } from 'react-redux';
import { getMarkedPosts } from '../store/actions'
const indexs = [0, 1, 2, 3]
const defaultImage = "https://phutungnhapkhauchinhhang.com/wp-content/uploads/2020/06/default-thumbnail.jpg";
const { GrStar, RiHeartFill, RiHeartLine, FaRegClock, MdLocationPin, TbReportMoney, RiCrop2Line } = icons
const Item = ({ images, user, title, star, description, attributes, address, id, createdAt }) => {
    const dispatch = useDispatch();
    const [isHoverHeart, setIsHoverHeart] = useState(false)
    const { currentData } = useSelector(state => state.user);
    const userId = currentData?.id;

    const [isMarked, setIsMarked] = useState(false);
    const { markedPosts } = useSelector(state => state.post.markedPosts);
    useEffect(() => {
        if (userId) {
            dispatch(getMarkedPosts(userId));
        }
    }, [dispatch, userId]);
    useEffect(() => {
        if (!userId) {
            setIsMarked(false); // Nếu userId là null, đặt lại isMarked thành false
        } else if (markedPosts) {
            setIsMarked(markedPosts.some(mark => mark.postId === id));
        }
    }, [id, userId, markedPosts]);
    const handleStar = (star) => {
        let stars = []
        for (let i = 1; i <= +star; i++) stars.push(<GrStar className="star-item" style={{ color: '#fbbf24' }} size={23} />)
        return stars

    }
    const formatTime = (createdAt) => {
        return moment(createdAt).fromNow()
    }

    const markPost = async () => {
        try {
            // Gọi API để đánh dấu bài đăng
            const response = await apiMarkPost(id, userId); // Truyền vào id của bài đăng và id của người dùng

            // Xử lý kết quả trả về từ API (nếu cần)
            console.log(response); // In ra kết quả từ API để kiểm tra

            // Đánh dấu thành công, cập nhật trạng thái
            setIsMarked(true);
        } catch (error) {
            console.error('Error marking post:', error);
        }
    };
    return (
        <div className='w-full flex gap-5 py-4' style={{ borderTop: '1px dashed rgba(0, 185, 142, .3)' }}>
            <div className='w-2/5 flex flex-wrap gap-[2px] items-center relative cursor-pointer'>
                <Link to={`${path.DETAIL}${formatVietnameseToString(title?.replaceAll('/', ''))}/${id}`} className='w-full h-full flex flex-wrap gap-[2px] items-center relative'>
                    {images.length > 0 && images.filter((i, index) => indexs.some(i => i === index))?.map((i, index) => {
                        return (
                            <img key={index} src={i} alt="preview" className='w-[48%] h-[150px] object-cover' />
                        )
                    })}
                    {[...Array(Math.max(0, 4 - images.length))].map((_, index) => (
                        <img key={index} src={defaultImage} alt="default" className='w-[48%] h-[150px] object-cover' />
                    ))}
                    <span className='bg-overlay-70 text-white px-2 rounded-md absolute left-3 bottom-3'>{`${images.length} ảnh`}</span>
                </Link>
                <div className='w-full flex items-center'>
                    <span
                        className='text-white absolute right-10 bottom-3 cursor-pointer'
                        onMouseEnter={() => setIsHoverHeart(true)}
                        onMouseLeave={() => setIsHoverHeart(false)}
                        onClick={markPost} // Gọi hàm markPost khi người dùng click vào nút
                    >
                        {isHoverHeart || isMarked ? <RiHeartFill size={30} color='red' /> : <RiHeartLine size={30} />}
                    </span>
                </div>
            </div>
            <div className="w-3/5 text-justify">
                <div className=" flex justify-between gap-4  w-full">
                    <Link to={`${path.DETAIL}${formatVietnameseToString(title?.replaceAll('/', ''))}/${id}`}
                        className="text-[#0E2E50] hover:text-[#009472] font-medium ml-1 text-lg"
                    >
                        {handleStar(+star).length > 0 && handleStar(+star).map((star, number) => {
                            return (
                                <span key={number}>{star}</span>
                            )
                        })}
                        {title}

                    </Link>

                </div>
                <div className="my-2 flex items-center justify-between text-base">
                    <span className="flex items-center font-bold text-[#E03C31] whitespace-nowrap overflow-hidden text-ellipsis text-lg">
                        <TbReportMoney className="mr-1" style={{ color: '#00B98E' }} />
                        {attributes?.price}
                    </span>
                    <span className='flex items-center whitespace-nowrap text-[#0E2E50] overflow-hidden text-ellipsis'>
                        <RiCrop2Line className="mr-1" style={{ color: '#00B98E' }} />
                        {attributes?.acreage}
                    </span>
                    <span className='flex items-center whitespace-nowrap text-[#0E2E50] overflow-hidden text-ellipsis'>
                        <MdLocationPin className="mr-1" style={{ color: '#00B98E' }} />
                        {`${address
                            .split(',')
                            .slice(-2)[0] // Lấy phần tử cuối cùng trong mảng
                            .trim()}`} {/* Loại bỏ khoảng trắng dư thừa */}
                    </span>


                </div>
                <p className='text-[#666565] text-base w-full h-[70px] text-ellipsis overflow-hidden'>
                    {description}
                </p>
                <div className="flex items-center my-5  justify-between mt-10">
                    <div className="flex gap-2 items-center text-base">
                        <img src={user?.avatar || "https://hethongxephangtudong.net/public/client/images/no-avatar.png"} alt="avatar" className="w-[50px] h-[50px] object-cover rounded-full " />
                        <p>{user?.name ?? 'Huyền Trang'}</p>
                    </div>
                    <div className="flex items-center gap-1 ">
                        <button type="button" className="bg-[#00B98E] text-base text-white p-1 rounded-md h-[30px]">
                            {`Gọi ${user?.phone || '0328626789'}`}
                        </button>
                        <a
                            href={`https://zalo.me/${user?.zalo}`}
                            target='_blank'
                            className="text-[#00B98E] h-[30px]  text-base px-1 rounded-md border hover:bg-[#00B98E] hover:text-[#ffffff] border-[#00B98E]"
                        >
                            Nhắn tin Zalo
                        </a>

                    </div>
                </div>
                <span className="flex items-center text-[#0E2E50] whitespace-nowrap">
                    <FaRegClock className="mr-1" style={{ color: '#00B98E' }} />
                    {attributes?.published}
                </span>


            </div>

        </div>

    )
}

export default memo(Item)