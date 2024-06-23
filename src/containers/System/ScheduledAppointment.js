import React, { useEffect, useState } from 'react';
import icons from '../../ultils/icons';
import * as actions from '../../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments, getCurrent, approveAppointment } from '../../store/actions';
import { Link } from 'react-router-dom'; // Import thêm Link từ react-router-dom
import { formatVietnameseToString } from '../../ultils/Common/formatVietnameseToString';
import Swal from 'sweetalert2';
import { path } from '../../ultils/constant';
import { deleteAppointment } from '../../services/appointment'; // Import hàm xóa lịch hẹn từ service
import io from 'socket.io-client';
import { CustomCalendar } from '../../components';

const socket = io.connect("http://3.107.49.162:5000");
const { MdDeleteForever, IoMdCheckmarkCircle, MdCancel } = icons;

const ScheduledAppointment = () => {
    const dispatch = useDispatch();
    const { currentData, users } = useSelector(state => state.user);

    const { posts } = useSelector(state => state.post);
    const { appointmentsPosters } = useSelector(state => state.appointments);
    const [status, setStatus] = useState('0');
    const [stt, setStt] = useState(1);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const appointmentsPerPage = 5;
    const [viewMode, setViewMode] = useState('manage'); // 'manage' or 'calendar'



    useEffect(() => {
        const posterId = currentData?.id;
        if (posterId) {
            dispatch(actions.fetchAppointmentsPoster(posterId));
        }
    }, [currentData?.id, dispatch]);


    useEffect(() => {
        dispatch(actions.getPosts()); // Gọi API để lấy dữ liệu bài đăng từ server mỗi khi component được mount

        // Xóa dữ liệu bài đăng khỏi Redux store khi component bị unmount
        return () => {
            dispatch({ type: 'CLEAR_POSTS' });
        };
    }, [dispatch]);



    const handleDeleteAppointment = async (appointmentId) => {
        // Sử dụng SweetAlert2 để hỏi người dùng chắc chắn muốn xóa không
        const result = await Swal.fire({
            title: 'Bạn chắc chắn muốn xóa lịch hẹn?',
            text: 'Hành động này sẽ không thể hoàn tác!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có!',
            cancelButtonText: 'Không'
        });

        if (result.isConfirmed) {
            try {
                await deleteAppointment(appointmentId);
                // Refresh danh sách lịch hẹn sau khi xóa thành công
                const userId = currentData?.id;
                if (userId) {
                    dispatch(fetchAppointments(userId));
                }
                Swal.fire('Thành công', 'Xóa lịch hẹn thành công', 'success');
            } catch (error) {
                console.error('Failed to delete appointment:', error);
                Swal.fire('Oops!', 'Xóa lịch hẹn thất bại', 'error');
            }
        }
    };
    useEffect(() => {
        const currentDate = new Date();
        const filtered = appointmentsPosters.filter(appointment => {
            const appointmentDate = new Date(appointment.appointmentDate);
            return appointmentDate >= currentDate;
        });
        setFilteredAppointments(filtered); // Update filteredAppointment whenever appointmentData changes
    }, [appointmentsPosters]);

    const handleApproveAppointment = async (appointmentId) => {
        const appointment = filteredAppointments.find(item => item.id === appointmentId);
        if (!appointment || appointment.status !== 'Pending') {
            Swal.fire('Thông báo', 'Không thể xác nhận lịch hẹn này!', 'warning');
            return;
        }

        const result = await Swal.fire({
            title: 'Xác nhận lịch hẹn',
            text: 'Bạn có chắc chắn muốn xác nhận lịch hẹn này?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            dispatch(approveAppointment(appointmentId))
                .then(() => {
                    socket.emit('send_notification', {
                        userId: appointment.appointmentRequesterID,
                        content: 'Lịch hẹn đã được xác nhận.',
                        appointmentId: appointmentId
                    });
                    Swal.fire('Thành công', 'Xác nhận lịch hẹn thành công!', 'success');
                })
                .catch(error => {
                    console.error('Failed to approve appointment:', error);
                    Swal.fire('Oops!', 'Xác nhận lịch hẹn thất bại', 'error');
                });
        }
    };
    const handleCancelAppointment = async (appointmentId) => {
        const appointment = filteredAppointments.find(item => item.id === appointmentId);
        if (!appointment || appointment.status !== 'Pending') {
            Swal.fire('Thông báo', 'Không thể hủy lịch hẹn này!', 'warning');
            return;
        }

        const result = await Swal.fire({
            title: 'Xác nhận hủy lịch hẹn!',
            text: 'Bạn có chắc chắn muốn hủy lịch hẹn này?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            dispatch(actions.cancelAppointment(appointmentId))
                .then(() => {
                    socket.emit('send_notification', {
                        userId: appointment.appointmentRequesterID,
                        content: 'Lịch hẹn của bạn đã bị từ chối',
                        appointmentId: appointmentId
                    });
                    Swal.fire('Thành công', 'Hủy lịch hẹn thành công!', 'success');
                })
                .catch(error => {
                    console.error('Failed to cancel appointment:', error);
                    Swal.fire('Oops!', 'Hủy lịch hẹn thất bại', 'error');
                });
        }
    };
    useEffect(() => {
        // Lắng nghe sự kiện khi có thông báo mới
        socket.on('new_notification', () => {
            // Thực hiện cập nhật số lượng thông báo chưa đọc tại đây
            // Ví dụ: setUnreadNotificationCount(newCount);
        });

        // Xóa lắng nghe sự kiện khi component bị unmount để tránh rò rỉ bộ nhớ
        return () => {
            socket.off('new_notification');
        };
    }, []);





    const handleFilterChange = (e) => {
        const selectedStatus = e.target.value;
        setStatus(selectedStatus);
        if (selectedStatus === '0') {
            setFilteredAppointments(appointmentsPosters);
        } else {
            const filtered = appointmentsPosters.filter(appointment => appointment.status === selectedStatus);
            setFilteredAppointments(filtered);
        }
    };

    const indexOfLastAppointment = currentPage * appointmentsPerPage;
    const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
    const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

    // Hàm chuyển trang
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);

    // Tạo một mảng chứa số trang có lịch hẹn
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    useEffect(() => {
        dispatch(actions.getAllUser());
    }, [dispatch]);

    return (
        <div className='flex flex-col gap-6'>
            <div className='py-4 border-b border-gray-200 flex items-center justify-between'>
                <h1 className='text-3xl font-medium'>Quản lý lịch hẹn</h1>
                <div className='flex items-center gap-4'>
                    <button
                        className={`outline-none border p-2 rounded-md ${viewMode === 'manage' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
                        onClick={() => setViewMode('manage')}
                    >
                        Quản lý lịch hẹn
                    </button>
                    <button
                        className={`outline-none border p-2 rounded-md ${viewMode === 'calendar' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
                        onClick={() => setViewMode('calendar')}
                    >
                        Xem lịch
                    </button>
                    <select className='outline-none border p-2 border-gray-200 rounded-md' value={status} onChange={handleFilterChange}>
                        <option value="0">Lọc theo trạng thái</option>
                        <option value="Pending">Chờ xác nhận</option>
                        <option value="Approved">Đã chấp nhận</option>
                        <option value="Canceled">Đã hủy</option>
                    </select>
                </div>
            </div>

            {viewMode === 'manage' ? (
                <table className='w-full table-auto'>
                    <thead className='bg-gray-100'>
                        <tr className='flex w-full'>
                            <th className='border w-[60px] p-2'>STT</th>
                            <th className='border flex-1 p-2'>Tên bài đăng</th>
                            <th className='border flex-1 p-2'>Tên người hẹn</th>
                            <th className='border flex-1 p-2'>SĐT người hẹn</th>
                            <th className='border flex-1 p-2'>Ngày hẹn</th>
                            <th className='border flex-1 p-2'>Thời gian hẹn</th>
                            <th className='border flex-1 p-2'>Nội dung</th>
                            <th className='border flex-1 p-2'>Trạng thái</th>
                            <th className='border flex-1 p-2'>Tùy chọn</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentAppointments.length > 0 ? (
                            currentAppointments.map((item, index) => {
                                const post = posts.find(post => post.id === item?.postId);
                                const requester = users.find(user => user.id === item?.appointmentRequesterID);

                                return (
                                    <tr key={item?.id} className='flex h-16 text-sm items-center'>
                                        <td className='border w-[60px] h-full text-center flex items-center justify-center'>
                                            {stt + index}
                                        </td>
                                        <td className='border px-2 flex-1 h-full flex items-center justify-center '>
                                            {post ? (
                                                <Link to={`${path.DETAIL}${formatVietnameseToString(post?.title?.replaceAll('/', ''))}/${post?.id}`}>
                                                    {post?.title.length > 50 ? post?.title.slice(0, 50) + '...' : post?.title}
                                                </Link>
                                            ) : (
                                                'Unknown Title'
                                            )}
                                        </td>
                                        <td className='border px-2 flex-1 h-full text-center flex items-center justify-center'>{requester?.name}</td>
                                        <td className='border px-2 flex-1 h-full text-center flex items-center justify-center'>{requester?.phone}</td>
                                        <td className='border px-2 flex-1 h-full text-center flex items-center justify-center'>{item?.appointmentDate && new Date(item?.appointmentDate).toLocaleDateString()}</td>
                                        <td className='border px-2 flex-1 h-full text-center flex items-center justify-center'>{item?.appointmentTime}</td>
                                        <td className='border px-2 flex-1 h-full text-center flex items-center justify-center'>{item?.content?.slice(0, 40)}</td>
                                        <td className='border px-2 flex-1 h-full text-center flex items-center justify-center'>
                                            {item?.status === 'Pending' ? (
                                                <span className='delivery_status px-2.5 py-0.5 inline-block font-medium rounded border bg-yellow-100 border-yellow-200 text-yellow-500 dark:bg-yellow-500/20 dark:border-yellow-500/20'>
                                                    {item?.status}
                                                </span>
                                            ) : item?.status === 'Canceled' ? (
                                                <span className='delivery_status px-2.5 py-0.5 inline-block font-medium rounded border bg-red-100 border-transparent text-red-500 dark:bg-red-500/20 dark:border-transparent'>
                                                    {item?.status}
                                                </span>
                                            ) : (
                                                <span className='delivery_status px-2.5 py-0.5 inline-block font-medium rounded border bg-green-100 border-green-200 text-green-500 dark:bg-green-500/20 dark:border-green-500/20'>
                                                    {item?.status}
                                                </span>
                                            )}
                                        </td>
                                        <td className='border px-2 flex-1 h-full text-center items-center  flex gap-2 justify-center'>
                                            <IoMdCheckmarkCircle
                                                color='green'
                                                size={28}
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleApproveAppointment(item?.id)}
                                            />
                                            <MdCancel
                                                color='red'
                                                size={28}
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleCancelAppointment(item?.id)}
                                            />
                                            <MdDeleteForever
                                                color='red'
                                                size={32}
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleDeleteAppointment(item?.id)}
                                            />
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">Không có lịch hẹn nào!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            ) : (
                <CustomCalendar appointments={filteredAppointments} />
            )}

            {filteredAppointments.length > appointmentsPerPage && viewMode === 'manage' && (
                <div className="flex items-center justify-center gap-4 mt-4">
                    <button className={`border px-3 py-1 ${currentPage === 1 ? 'bg-gray-300 text-gray-600' : 'bg-white text-black'}`}
                        onClick={() => paginate(1)} disabled={currentPage === 1}>Trang trước</button>
                    {pageNumbers.map((pageNumber) => (
                        <button className={`border px-3 py-1 ${currentPage === pageNumber ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
                            key={pageNumber} onClick={() => paginate(pageNumber)} disabled={pageNumber === currentPage}>{pageNumber}</button>
                    ))}
                    <button className={`border px-3 py-1 ${currentPage === totalPages ? 'bg-gray-300 text-gray-600' : 'bg-white text-black'}`}
                        onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>Trang sau</button>
                </div>
            )}
        </div>
    );

};

export default ScheduledAppointment;
