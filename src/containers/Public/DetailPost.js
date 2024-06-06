import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getPostsLimit, getRelatedPosts } from '../../store/actions'
import { Comment, Map, PopularRentalPrices, SliderPost } from '../../components'
import icons from '../../ultils/icons'
import objToArr from '../../ultils/Common/objToArr'
import { useNavigate, createSearchParams } from 'react-router-dom'
import { ItemSidebar, NewPost } from "../../components"
import { path } from '../../ultils/constant'
import { Appointment, Chat, ListCardItem } from "./index"
import MapBox from '../../components/MapBox'
import Swal from 'sweetalert2'
import io from 'socket.io-client';
import { createNewChatRoom } from '../../services/chat'

const socket = io.connect("http://localhost:5000");

const { GrStar, MdLocationPin, TbReportMoney, RiCrop2Line, FaRegClock, FaPhoneAlt, IoCalendarNumberOutline, HiOutlineChatBubbleLeftRight, GiPayMoney, LuBarChart3, SiZalo, HiLocationMarker } = icons

const DetailPost = () => {
    const { postId } = useParams()
    const { currentData } = useSelector(state => state.user);

    const dispatch = useDispatch()
    const { posts } = useSelector(state => state.post)
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false);
    const [showChat, setShowChat] = useState(false)
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const isSameUser = posts[0]?.userId === currentData?.id;
    const address = posts[0]?.address
    const [chatUsers, setChatUser] = useState(null);




    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    useEffect(() => {
        postId && dispatch(getPostsLimit({ id: postId }))

    }, [postId])

    const handleStar = (star) => {
        let stars = [];
        for (let i = 1; i <= +star; i++) stars.push(<GrStar className="star-item" style={{ color: '#fbbf24' }} size={23} />);
        return stars;
    };
    const handleFilterLabel = () => {
        const titleSearch = `Tìm kiếm bài đăng theo chuyên mục ${posts[0]?.labelData?.value}`
        navigate({
            pathname: `/${path.SEARCH}`,
            search: createSearchParams({ labelCode: posts[0]?.labelData?.code }).toString()
        }, { state: { titleSearch } });
    }

    const handleAppointmentClick = () => {
        if (isLoggedIn) {
            if (isSameUser) {
                // Hiển thị thông báo rằng không thể đặt lịch hẹn cho bài đăng của chính mình
                Swal.fire({
                    icon: 'error',
                    title: 'Không thể đặt lịch hẹn cho bài đăng của chính mình',
                });
            } else {
                openModal();
            }
        } else {
            navigate(`/${path.LOGIN}`); // Navigate to login page if not logged in
        }
    };

    const handleChatClick = async () => {
        if (isLoggedIn) {
            if (isSameUser) {
                Swal.fire({
                    icon: 'error',
                    title: 'Bạn không thể chat với chính mình!',
                });
                return;
            }

            try {
                const userToChat = {
                    id: posts[0]?.user?.id,
                    name: posts[0]?.user?.name,
                    avatar: posts[0]?.user?.avatar
                };
                setChatUser(userToChat);

                const roomId = `${currentData.id}-${posts[0].userId}`;
                await createNewChatRoom(currentData.id, posts[0].userId); // Gọi API tạo room chat mới
                socket.emit("join_room", roomId);
                setShowChat(true);
            } catch (error) {
                if (error.response && error.response.data && error.response.data.error === 'Conversation already exists') {
                    setShowChat(true);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Đã xảy ra lỗi khi tạo phòng chat!',
                    });
                }
            }
        } else {
            navigate(`/${path.LOGIN}`);
        }
    };
    const handleCloseChat = () => {
        setShowChat(false);
    };




    return (
        <div className='w-full'>
            <div className='w-full flex gap-4'>
                <div className='w-[70%] border bg-white border-gray-300 rounded-lg p-4' >
                    <SliderPost
                        images={posts && posts.length > 0 && JSON.parse(posts[0]?.images?.image)}
                        video={posts && posts.length > 0 && posts[0]?.video}
                    />
                    <div className='flex flex-col gap-3 mt-5'>
                        <h2 className='text-2xl font-bold text-[#0E2E50]'>
                            {handleStar(+posts[0]?.star).map((star, number) => (
                                <span key={number}>{star}</span>
                            ))}
                            {posts[0]?.title}
                        </h2>

                        <div className='flex items-center gap-2'>
                            <LuBarChart3 size={20} color='#009472' />
                            <span>Xem lịch sử giá:</span>
                            <span className='text-[#E03C31] font-medium hover:text-[#009472] cursor-pointer'
                            >
                                {posts[0]?.labelData?.value}

                            </span>
                        </div>
                        <div className='flex items-center gap-3'>
                            <MdLocationPin size={20} color='#009472' />
                            <span>{posts[0]?.address}</span>
                        </div>
                        <div className='flex items-center gap-16'>
                            <span className='flex items-center gap-3'>
                                <TbReportMoney size={20} color='#009472' />
                                <span className='font-semibold text-xl text-[#009472]'>{posts[0]?.attributes?.price}</span>
                            </span>
                            <span className='flex items-center gap-3'>
                                <RiCrop2Line size={20} color='#009472' />
                                <span>{posts[0]?.attributes?.acreage}</span>
                            </span>
                            <span className='flex items-center gap-3'>
                                <FaRegClock size={20} color='#009472' />
                                <span>{posts[0]?.attributes?.published}</span>

                            </span>
                        </div>

                    </div>
                    <div className='mt-8'>
                        <h3 className='font-semibold text-xl my-4'> Thông tin mô tả</h3>
                        <div className='flex flex-col gap-3 '>

                            {posts[0]?.description && JSON.parse(posts[0]?.description)?.map((item, index) => {
                                return (<span key={index}>{item}</span>)
                            })}
                        </div>
                    </div>
                    <div className='mt-8'>

                        <PopularRentalPrices postId={postId} />

                    </div>

                    {posts && <div className='mt-8'>
                        <h3 className='font-semibold text-xl my-4'> Bản đồ</h3>
                        <div className="mt-4">
                            {/* <Map address={posts[0].address} /> */}
                            <MapBox address={address} showCurrentLocation={true} />
                        </div>
                    </div>}
                    <div className='mt-8'>
                        <h3 className='font-semibold text-xl my-4'> Bình luận</h3>

                        <Comment />

                    </div>
                    <div className='mt-8'>

                        <ListCardItem />

                    </div>





                </div>

                <div className='w-[30%] flex flex-col justify-start items-center'>
                    <div className="mb-5 w-full p-4 bg-[#febb02] border border-gray-300 rounded-lg">
                        <div className=" block text-center">
                            <div className="flex flex-col items-center justify-center text-lg font-bold">
                                <img
                                    src={posts[0]?.user?.avatar || 'https://hethongxephangtudong.net/public/client/images/no-avatar.png'}
                                    alt="avatar"
                                    className="w-[100px] h-[100px] object-cover rounded-full mb-4"
                                />
                                <p className="mt-2">{posts[0]?.user?.name}</p>
                                <div className="phone w-[100%] mt-3 justify-center border-[#00B98E] border rounded-lg  h-[40px] flex gap-3 items-center bg-[#00B98E] ">
                                    <FaPhoneAlt size={24} color="white" />
                                    <button className=" text-white">{posts[0]?.user?.phone}</button>
                                </div>
                                <div className="phone w-[100%] mt-3 justify-center bg-white border rounded-lg  h-[40px] flex gap-3 items-center  ">
                                    <SiZalo size={24} color="blue" />
                                    <a
                                        href={`https://zalo.me/${posts[0]?.user?.zalo}`}
                                        target='_blank'
                                        className="text-black font-semibold"
                                    >{posts[0]?.user?.zalo}</a>
                                </div>
                                <div className="phone w-[100%] mt-3 justify-center  border rounded-lg  h-[40px] flex gap-3 items-center bg-white ">
                                    <IoCalendarNumberOutline size={24} color="#00B98E" />
                                    <button className="text-black font-semibold" onClick={handleAppointmentClick}>
                                        Đặt lịch hẹn
                                    </button>

                                    {showModal && (
                                        <div className="modal">
                                            <div className="modal-content">
                                                <span className="close" onClick={closeModal}>&times;</span>
                                                <Appointment />
                                            </div>
                                        </div>
                                    )}
                                    {/* <button className="text-black font-semibold">
                                    <Link to={`/${path.APPOINTMENT}`}>Đặt lịch hẹn</Link>
                                </button> */}
                                </div>
                                <div className="phone w-[100%] mt-3 justify-center border rounded-lg h-[40px] flex gap-3 items-center bg-white">
                                    <HiOutlineChatBubbleLeftRight size={24} color="black" />
                                    <button className="text-black font-semibold" onClick={handleChatClick}>
                                        Trò chuyện
                                    </button>


                                </div>


                            </div>
                        </div>
                    </div>
                    {showChat && (
                        <div className='fixed bottom-0 right-0 w-[50%] lg:w-[50%] h-[78%] p-2'>
                            <Chat onClose={handleCloseChat} chatUsers={chatUsers} socket={socket} username={currentData?.name} room={`${currentData?.id}-${posts[0]?.userId}`} />
                        </div>
                    )}
                    <div className="mb-6 w-full p-3 bg-white border border-gray-300 rounded-lg">
                        <NewPost />
                    </div>
                    <div className="mb-6 w-full p-3 bg-white border border-gray-300 rounded-lg">
                        <NewPost newPost />
                    </div>

                </div>
            </div>


        </div>


    )
}

export default DetailPost