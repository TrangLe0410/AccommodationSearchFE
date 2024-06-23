import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../store/actions';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { formatVietnameseToString } from '../../ultils/Common/formatVietnameseToString';
import { path } from '../../ultils/constant';
import moment from 'moment';
import Pagination from './Pagination'; // Import Pagination component
import icons from '../../ultils/icons';
import { FaSearch } from "react-icons/fa";
import { apiGetPaymentHistory } from '../../services';
const { IoMdCheckmarkCircle, MdCancel, FiSearch } = icons;

const ManageAllPost = () => {
    const dispatch = useDispatch();
    const { posts: allPosts } = useSelector(state => state.post);

    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;
    const [status, setStatus] = useState('0');
    const [visibility, setVisibility] = useState('0');
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    useEffect(() => {
        dispatch(actions.getPosts()); // Fetch posts when component mounts

        return () => {
            dispatch({ type: 'CLEAR_POSTS' }); // Clear posts on unmount
        };
    }, [dispatch]);

    useEffect(() => {
        setCurrentPage(1); // Reset current page when status changes
    }, [visibility]);

    useEffect(() => {
        filterPosts();
    }, [searchKeyword, visibility, allPosts, currentPage]);

    const filterPosts = () => {
        let filteredPosts = allPosts;
        if (visibility !== '0') {
            filteredPosts = filteredPosts.filter(item => item.visibility === visibility);
        }
        if (searchKeyword.trim() !== '') {
            filteredPosts = filteredPosts.filter(item => item.title.toLowerCase().includes(searchKeyword.toLowerCase()));
        }
        setFilteredPosts(filteredPosts);
    };

    const handleApprovePost = async (postId) => {
        const post = filteredPosts.find(item => item.id === postId);

        if (!post || post.status !== 'Pending') {
            Swal.fire('Thông báo', 'Không thể duyệt bài đăng này!', 'warning');
            return;
        }

        const result = await Swal.fire({
            title: 'Xác nhận duyệt bài đăng',
            text: 'Bạn có chắc chắn muốn duyệt bài đăng này?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Duyệt',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            dispatch(actions.approvePost(postId));
        }
    };

    const handleCancelPost = async (postId) => {
        const post = filteredPosts.find(item => item.id === postId);

        if (!post || post.status !== 'Pending') {
            Swal.fire('Thông báo', 'Không thể hủy bài đăng này!', 'warning');
            return;
        }

        const result = await Swal.fire({
            title: 'Xác nhận hủy bài đăng',
            text: 'Bạn có chắc chắn muốn hủy bài đăng này?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            dispatch(actions.cancelPost(postId));
        }
    };
    const [paymentHistory, setPaymentHistory] = useState([]);
    useEffect(() => {
        const fetchPaymentHistory = async () => {
            try {
                const data = await apiGetPaymentHistory();
                setPaymentHistory(data.paymentHistory); // Đặt dữ liệu trả về từ API vào state
            } catch (error) {
                console.error("Error fetching transaction history:", error);
            }
        };

        fetchPaymentHistory();
    }, []);
    const getPaymentDetails = (postId) => {
        const payment = paymentHistory.find(payment => payment.postId === postId);
        if (payment) {
            return {
                type: payment.typePost, // Assuming 'type' field exists in paymentHistory
                status: payment.status // Assuming 'status' field exists in paymentHistory
            };
        }
        return {
            type: 'Tin miễn phí',
            status: 'Chưa thanh toán'
        };
    };

    const checkStatus = (dateString) => moment(dateString, process.env.REACT_APP_FORMAT_DATE).isAfter(new Date().toDateString());

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className='flex flex-col gap-6'>
            <div className='py-4 border-b border-gray-200 flex items-center justify-between'>
                <h1 className='text-3xl font-medium '>Bài đăng trong hệ thống</h1>
                <div className="flex items-center">
                    <select onChange={e => setVisibility(e.target.value)} value={visibility} className='outline-none border p-2 border-gray-200 rounded-md mr-4'>
                        <option value="0">Lọc theo hiển thị</option>
                        <option value="Visible">Tin hiển thị</option>
                        <option value="Hidden">Tin đang ẩn</option>
                    </select>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={searchKeyword}
                            onChange={e => setSearchKeyword(e.target.value)}
                            className="outline-none border p-2 border-gray-200 rounded-md pl-8" // Thêm class để tạo khoảng cách cho icon
                        />

                        {/* Icon FiSearch */}
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch color='gray-200' /> {/* Sử dụng icon FiSearch */}
                        </div>
                    </div>
                </div>

            </div>

            {allPosts.length > 0 ? (
                <>
                    <table className='w-full table-auto bg-white'>
                        <thead className='bg-gray-100'>
                            <tr className='flex w-full'>
                                <th className='border flex-1 p-2'>Mã tin</th>
                                <th className='border flex-1 p-2'>Ảnh đại diện</th>
                                <th className='border flex-[5%] p-2'>Tiêu đề</th>
                                <th className='border flex-1 p-2'>Gía</th>
                                <th className='border flex-1 p-2'>Hoạt động</th>
                                <th className='border flex-1 p-2'>Trạng thái</th>
                                <th className='border flex-1 p-2'>Loại tin</th>
                                <th className='border flex-[3%] p-2'>Thanh toán</th>
                                <th className='border flex-1 p-2'>Tùy chọn</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPosts.map(item => {
                                const paymentDetails = getPaymentDetails(item.id);
                                return (
                                    <tr className='flex h-[70px] text-sm items-center' key={item.id}>
                                        <td className='border px-2 flex-1 h-full text-center flex items-center justify-center '>{item?.overviews?.code}</td>
                                        <td className='border px-2 flex-1 h-full flex items-center justify-center  '>
                                            <img src={JSON.parse(item?.images?.image)[0] || ''} alt='avt-post' className='w-10 h-10 object-cover rounded-md' />
                                        </td>
                                        <td className='border px-2 flex-[5%] h-full text-center flex items-center justify-center '>
                                            <Link to={`${path.DETAIL}${formatVietnameseToString(item?.title?.replaceAll('/', ''))}/${item?.id}`}>
                                                {item?.title?.slice(0, 40)}
                                            </Link>
                                        </td>
                                        <td className='border px-2 flex-1 h-full text-center flex items-center justify-center '> {item?.attributes?.price}</td>
                                        <td className='border px-2 flex-1 h-full text-center flex justify-center items-center'>

                                            {item?.visibility === 'Visible' && (
                                                <span className='text-green-500'>Tin đang hiển thị</span>
                                            )}
                                            {item?.visibility === 'Hidden' && (
                                                <span className='text-red-500'>Tin đã ẩn</span>
                                            )}
                                        </td>
                                        <td className='border px-2 flex-1 h-full text-center flex items-center justify-center'>
                                            {item.status === 'Pending' ? (
                                                <span className='delivery_status px-2.5 py-0.5 inline-block font-medium rounded border bg-yellow-100 border-yellow-200 text-yellow-500 dark:bg-yellow-500/20 dark:border-yellow-500/20'>
                                                    {item.status}
                                                </span>
                                            ) : item.status === 'Canceled' ? (
                                                <span className='delivery_status px-2.5 py-0.5 inline-block font-medium rounded border bg-red-100 border-transparent text-red-500 dark:bg-red-500/20 dark:border-transparent'>
                                                    {item.status}
                                                </span>
                                            ) : (
                                                <span className='delivery_status px-2.5 py-0.5 inline-block font-medium rounded border bg-green-100 border-green-200 text-green-500 dark:bg-green-500/20 dark:border-green-500/20'>
                                                    {item.status}
                                                </span>
                                            )}
                                        </td>
                                        <td className='border px-2 flex-1 h-full text-center flex items-center justify-center'>

                                            <div
                                                className={`border rounded-sm p-1 text-white font-semibold ${paymentDetails?.type === 'priority' ? 'bg-yellow-500 border-yellow-500' : 'bg-blue-500 border-blue-500'}`}
                                            >
                                                {paymentDetails?.type === 'priority' ? 'Tin ưu tiên' : 'Tin thường'}
                                            </div>
                                        </td>
                                        <td className='border px-2 flex-[3%] h-full text-center flex items-center justify-center'>
                                            {paymentDetails.status === 'Đã thanh toán' ? (
                                                <span className='delivery_status px-2.5 py-0.5 inline-block font-medium rounded border bg-green-100 border-green-200 text-green-500 dark:bg-green-500/20 dark:border-green-500/20'>
                                                    Đã thanh toán
                                                </span>
                                            ) : (
                                                <span className='delivery_status px-2.5 py-0.5 inline-block font-medium rounded border bg-red-100 border-transparent text-red-500 dark:bg-red-500/20 dark:border-transparent'>
                                                    Chưa thanh toán
                                                </span>
                                            )}
                                        </td>
                                        <td className='border px-2 flex-1 h-full text-center items-center flex gap-2 justify-center'>
                                            <IoMdCheckmarkCircle
                                                color='green'
                                                size={28}
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleApprovePost(item.id)}
                                            />
                                            <MdCancel
                                                color='red'
                                                size={28}
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleCancelPost(item.id)}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className="flex justify-center items-center mt-2">
                        <Pagination
                            postsPerPage={postsPerPage}
                            totalPosts={filteredPosts.length}
                            paginate={paginate}
                            currentPage={currentPage}
                        />
                    </div>

                </>
            ) : (
                <p>Không có bài đăng nào</p>
            )}
        </div>
    );
};

export default ManageAllPost;
