import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as actions from '../../store/actions'
import moment from "moment"
import { Button, UpdatePost } from '../../components'
import { apiDeletePost, apiHidePost, apiVisiblePost } from '../../services'
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom';
import { formatVietnameseToString } from '../../ultils/Common/formatVietnameseToString';
import { path } from '../../ultils/constant';
import { BiSolidHide } from "react-icons/bi";
import { FaRegEye } from "react-icons/fa";
const ManagePost = () => {
    const dispatch = useDispatch()
    const [isEdit, setIsEdit] = useState(false)
    const { postOfCurrent, dataEdit } = useSelector(state => state.post)
    const [updateData, setUpdateData] = useState(false)
    const [posts, setPosts] = useState([])
    const [status, setStatus] = useState('0')
    const [filteredPosts, setFilteredPosts] = useState([]);


    useEffect(() => {
        !dataEdit && setIsEdit(false)
    }, [dataEdit])
    useEffect(() => {
        if (!dataEdit) {
            dispatch(actions.getPostsLimitAdmin())
        }
    }, [dataEdit, updateData, dispatch])
    useEffect(() => {
        // Gọi action để lấy dữ liệu bài đăng khi component được render
        dispatch(actions.getPostsLimitAdmin())
    }, [dispatch])
    useEffect(() => {
        setPosts(postOfCurrent)
    }, [postOfCurrent])

    const handleDeletePost = async (postId) => {
        // Sử dụng SweetAlert2 để hỏi người dùng chắc chắn muốn xóa không
        const result = await Swal.fire({
            title: 'Bạn chắc chắn muốn xóa bài đăng?',
            text: 'Hành động này sẽ không thể hoàn tác!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có!',
            cancelButtonText: 'Không'
        });

        if (result.isConfirmed) {
            const response = await apiDeletePost(postId);

            if (response?.data.err === 0) {
                Swal.fire('Thành công', 'Xóa bài đăng thành công', 'success');
                setPosts(prevPosts => prevPosts.filter(item => item.id !== postId));
            } else {
                Swal.fire('Oops!', 'Xóa bài đăng thất bại', 'error');
            }
        }
    };

    useEffect(() => {
        if (status === '1') {
            const hiddenPosts = postOfCurrent?.filter(item => item?.visibility === 'Hidden');
            setPosts(hiddenPosts);
        } else if (status === '2') {
            const visiblePosts = postOfCurrent?.filter(item => item?.visibility === 'Visible');
            setPosts(visiblePosts);
        } else {
            setPosts(postOfCurrent);
        }
    }, [status, postOfCurrent]);

    useEffect(() => {
        setFilteredPosts(posts); // Update filteredAppointment whenever appointmentData changes
    }, [posts]);

    const handleHidePost = async (postId) => {
        // Kiểm tra nếu trạng thái của bài đăng không phải là 'Visible'
        const post = filteredPosts.find(item => item.id === postId);
        console.log(post)
        if (!post || post.visibility === 'Hiden') {
            Swal.fire('Thông báo', 'Bài đăng đã ẩn!', 'warning');
            return;
        }

        // Hiển thị hộp thoại xác nhận của SweetAlert2
        const result = await Swal.fire({
            title: 'Phòng đã được thuê, bạn muốn ẩn bài đăng này?',
            text: 'Bài đăng của bạn sẽ ẩn khỏi danh sách hiển thị',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có',
            cancelButtonText: 'Không'
        });

        // Nếu người dùng chọn xác nhận
        if (result.isConfirmed) {
            try {
                const response = await apiHidePost(postId);
                if (response?.data.err === 0) {
                    // Nếu API ẩn bài đăng thành công, cập nhật lại danh sách bài đăng
                    setUpdateData(prev => !prev);
                    Swal.fire('Thành công', 'Ẩn bài đăng thành công', 'success');
                } else {
                    Swal.fire('Oops!', 'Ẩn bài đăng thất bại', 'error');
                }
            } catch (error) {
                console.error('Error hiding post:', error);
                Swal.fire('Oops!', 'Đã có lỗi xảy ra', 'error');
            }
        }
    };

    const handleVisiblePost = async (postId) => {
        // Kiểm tra nếu trạng thái của bài đăng không phải là 'Visible'
        const post = filteredPosts.find(item => item.id === postId);
        console.log(post)
        if (!post || post.visibility === 'Visible') {
            Swal.fire('Thông báo', 'Bài đăng đang hiển thị!', 'warning');
            return;
        }

        // Hiển thị hộp thoại xác nhận của SweetAlert2
        const result = await Swal.fire({
            title: 'Bạn chắc chắn muốn hiển thị lại bài đăng?',
            text: 'Bài đăng của bạn sẽ hiển thị lên danh sách',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có',
            cancelButtonText: 'Không'
        });

        // Nếu người dùng chọn xác nhận
        if (result.isConfirmed) {
            try {
                const response = await apiVisiblePost(postId);
                if (response?.data.err === 0) {
                    // Nếu API ẩn bài đăng thành công, cập nhật lại danh sách bài đăng
                    setUpdateData(prev => !prev);
                    Swal.fire('Thành công', 'Hiển thị bài đăng thành công', 'success');
                } else {
                    Swal.fire('Oops!', 'Hiển thị bài đăng thất bại', 'error');
                }
            } catch (error) {
                console.error('Error hiding post:', error);
                Swal.fire('Oops!', 'Đã có lỗi xảy ra', 'error');
            }
        }
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(3);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    const paginate = pageNumber => setCurrentPage(pageNumber);
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(posts.length / postsPerPage); i++) {
        pageNumbers.push(i);
    }


    return (
        <div className='flex flex-col gap-6'>
            <div className='py-4 border-b border-gray-200 flex items-center justify-between'>
                <h1 className='text-3xl font-medium '>Quản lý bài đăng</h1>
                <select onChange={e => setStatus(e.target.value)} value={status} className='outline-none border p-2 border-gray-200 rounded-md'>
                    <option value="0">Lọc theo trạng thái</option>
                    <option value="1">Tin đã ẩn</option>
                    <option value="2">Tin đang hiển thị</option>
                </select>


            </div>
            <table className='w-full table-auto'>
                <thead className='bg-gray-100'>
                    <tr className='flex w-full'>
                        <th className='border w-[10%] p-2'>Mã tin</th>
                        <th className='border w-[20%] p-2'>Ảnh đại diện</th>
                        <th className='border w-[40%] p-2'>Tiêu đề</th>
                        <th className='border w-[10%] p-2'>Gía</th>
                        <th className='border w-[10%] p-2'>Trạng thái</th>
                        <th className='border w-[10%] p-2'>Tùy chọn</th>
                    </tr>
                </thead>
                <tbody>
                    {!posts
                        ? <tr>
                            <td colSpan="7" className="text-center">hahahaha</td>
                        </tr>
                        : currentPosts?.map(item => {
                            return (
                                <tr className='flex h-32 text-sm items-center justify-center' key={item.id}>
                                    <td className='border px-2 w-[10%] h-full text-center flex justify-center items-center '>{item?.overviews?.code}</td>
                                    <td className='border px-2 w-[20%] h-full flex items-center justify-center  '>
                                        <img src={JSON.parse(item?.images?.image)[0] || ''} alt='avt-post' className='w-28 h-28 object-cover rounded-md' />
                                    </td>
                                    <td className='border px-2 w-[40%] h-full p-2 '>
                                        <Link to={`${path.DETAIL}${formatVietnameseToString(item?.title?.replaceAll('/', ''))}/${item?.id}`} className='text-[#055699] font-bold'>
                                            {`${item?.title?.slice(0, 45)}...`}
                                        </Link>
                                        <p className='mt-1'>Địa chỉ: {item?.address}</p>
                                        {item?.visibility === 'Hidden' ? (
                                            <div className='flex gap-2 items-center mt-2'>
                                                <FaRegEye size={20} onClick={() => handleVisiblePost(item.id)} />
                                                <p>Hiển thị lại tin đăng</p>
                                            </div>
                                        ) : (
                                            <div className='flex gap-2 items-center mt-2'>
                                                <BiSolidHide onClick={() => handleHidePost(item.id)} size={20} />
                                                <p>Ẩn tin đăng</p>
                                            </div>
                                        )}
                                        <div className='flex gap-2 mt-1 items-center'>
                                            <p> Cập nhật gần nhất:</p>
                                            <p>{moment(item.updatedAt).format('DD/MM/YYYY HH:mm:ss')}</p>
                                        </div>
                                    </td>

                                    <td className='border px-2 w-[10%] h-full text-center flex justify-center items-center '> {item?.attributes?.price}</td>
                                    {/* <td className='border px-2  h-full text-center '> {item?.overviews?.created}</td>
                                    <td className='border px-2  h-full text-center '> {item?.overviews?.expired}</td> */}
                                    <td className='border px-2 w-[10%] h-full text-center flex justify-center items-center'>
                                        {item.status === 'Pending' && item?.visibility === 'Visible' && (
                                            <span className='   text-yellow-500 '>Tin đang chờ xét duyệt</span>
                                        )}
                                        {item.status === 'Approved' && item?.visibility === 'Visible' && (
                                            <span className='text-green-500'>Tin đang hiển thị</span>
                                        )}
                                        {item?.visibility === 'Hidden' && item?.status === 'Approved' && (
                                            <span className='text-red-500'>Tin đã ẩn</span>
                                        )}
                                    </td>
                                    <td className='border px-2 w-[10%] h-full text-center items-center  flex gap-2 justify-center'>
                                        <Button
                                            text='Sửa'
                                            bgColor='bg-green-600'
                                            textColor='text-white'
                                            onClick={() => {
                                                dispatch(actions.editData(item))
                                                setIsEdit(true)
                                            }}
                                        />
                                        <Button
                                            text='Xóa'
                                            bgColor='bg-red-600'
                                            textColor='text-white'
                                            onClick={() => handleDeletePost(item.id)}
                                        />

                                    </td>
                                </tr>
                            )
                        })}
                </tbody>
            </table>
            {posts.length > 3 && (
                <div className="pagination flex justify-center">
                    {pageNumbers.map(number => (
                        <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`px-3 py-1 mx-1 border rounded-md hover:bg-gray-200 focus:outline-none ${currentPage === number ? 'bg-gray-200 text-gray-800' : 'bg-white text-gray-600'}`}
                        >
                            {number}
                        </button>
                    ))}
                </div>
            )}

            {isEdit && <UpdatePost setIsEdit={setIsEdit} />}

        </div>
    )
}

export default ManagePost