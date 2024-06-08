import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../store/actions';
import Pagination from './Pagination'; // Import Pagination component
import icons from '../../ultils/icons';
import { FiSearch } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { IoIosLock } from "react-icons/io";
import { IoIosUnlock } from "react-icons/io";
const { MdDeleteForever } = icons;

const ManageUser = () => {
    const dispatch = useDispatch();
    const { users, msg } = useSelector(state => state.user); // Destructure users and msg from state
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5); // Number of users per page
    const [roleFilter, setRoleFilter] = useState(0); // State to store selected role filter
    const [statusFilter, setStatusFilter] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');

    useEffect(() => {
        dispatch(actions.getAllUser());
    }, [dispatch]);

    const filteredUsers = users.filter(user => {
        // Filter by role
        if (roleFilter !== 0 && user.role !== (roleFilter === 1 ? 'admin' : 'user')) {
            return false;
        }

        // Filter by status
        if (statusFilter !== 0) {
            const isLocked = statusFilter === 1;
            if ((isLocked && user.status !== 'locked') || (!isLocked && user.status === 'locked')) {
                return false;
            }
        }

        // Filter by search keyword (name or phone number)
        if (searchKeyword.trim() !== '') {
            const keyword = searchKeyword.toLowerCase();
            return (
                user.name.toLowerCase().includes(keyword) ||
                user.phone.includes(keyword)
            );
        }
        return true;
    });

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const handleRoleFilterChange = event => {
        setCurrentPage(1); // Reset current page when role filter changes
        setRoleFilter(parseInt(event.target.value));
    };

    const handleStatusFilterChange = event => {
        setCurrentPage(1);
        setStatusFilter(parseInt(event.target.value));
    };

    const handleLockUser = userId => {
        Swal.fire({
            title: 'Bạn chắc chắn khóa tài khoản này?',
            text: "Tài khoản này sẽ không được đăng nhập vào hệ thống!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Có, khóa tài khoản!'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(actions.lockUserAccount(userId));
                Swal.fire(
                    'Đã khóa!',
                    'Tài khoản của người dùng đã bị khóa.',
                    'success'
                );
            }
        });
    };

    const handleUnLockUser = userId => {
        Swal.fire({
            title: 'Bạn chắc chắn mở khóa tài khoản này?',
            text: "Tài khoản này sẽ được đăng nhập vào hệ thống!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Có, mở khóa!'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(actions.unLockUserAccount(userId));
                Swal.fire(
                    'Đã mở khóa!',
                    'Tài khoản của người dùng đã được mở khóa.',
                    'success'
                );
            }
        });
    };


    return (
        <div className='flex flex-col gap-6'>
            <div className='py-4 border-b border-gray-200 flex items-center justify-between'>
                <h1 className='text-3xl font-medium'>Người dùng trong hệ thống</h1>
                <div className="flex items-center gap-2">
                    <select onChange={handleRoleFilterChange} value={roleFilter} className='outline-none border p-2 border-gray-200 rounded-md'>
                        <option value={0}>Tất cả vai trò</option>
                        <option value={1}>Admin</option>
                        <option value={2}>User</option>
                    </select>
                    <select onChange={handleStatusFilterChange} value={statusFilter} className='outline-none border p-2 border-gray-200 rounded-md'>
                        <option value={0}>Tất cả trạng thái</option>
                        <option value={1}>Đã khóa</option>
                        <option value={2}>Đang hoạt động</option>
                    </select>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={searchKeyword}
                            onChange={e => setSearchKeyword(e.target.value)}
                            className="outline-none border p-2 border-gray-200 rounded-md pl-8"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch color='gray' /> {/* Sử dụng icon FiSearch */}
                        </div>
                    </div>
                </div>
            </div>

            <table className='w-full table-auto bg-white'>
                {/* Table headers */}
                <thead className='bg-gray-100 '>
                    <tr className='flex w-full'>

                        <th className='border flex-1 p-2'>Tên</th>
                        <th className='border flex-1 p-2'>Ảnh đại diện</th>
                        <th className='border flex-1 p-2'>Số điện thoại</th>
                        <th className='border flex-1 p-2'>Zalo</th>
                        <th className='border flex-1 p-2'>Số dư tài khoản</th>
                        <th className='border flex-1 p-2'>Role</th>
                        <th className='border flex-1 p-2'>Trạng thái</th>
                        <th className='border flex-1 p-2'>Tùy chọn</th>
                    </tr>
                </thead>

                <tbody>
                    {currentUsers.map(user => (
                        <tr className='flex h-16 text-sm items-center' key={user.id}>

                            <td className='border px-2 items-center justify-center flex flex-1 h-full text-center'>{user?.name}</td>
                            <td className='border px-2 items-center justify-center flex flex-1 h-full text-center '>
                                <img src={user?.avatar || 'https://hethongxephangtudong.net/public/client/images/no-avatar.png'} alt="avatar" className="object-cover w-10 h-10 rounded-md border-2 " />
                            </td>
                            <td className='border px-2 items-center justify-center flex flex-1 h-full text-center'>{user?.phone}</td>
                            <td className='border px-2 items-center justify-center flex flex-1 h-full text-center'>{user?.zalo}</td>
                            <td className='border px-2 items-center justify-center flex flex-1 h-full text-center'>{user?.balance || '0'}đ</td>
                            <td className='border px-2 items-center justify-center flex flex-1 h-full text-center' style={{ color: user?.role === 'admin' ? 'red' : 'green' }}>{user?.role}</td>
                            <td className='border px-2 items-center justify-center flex flex-1 h-full text-center'>
                                {user.status === 'locked' ? (
                                    <span className='delivery_status px-2.5 py-0.5 inline-block font-medium rounded border bg-red-100 border-transparent text-red-500 dark:bg-red-500/20 dark:border-transparent'>
                                        Tài khoản bị khóa
                                    </span>
                                ) : user.status === 'active' ? (
                                    <span className='delivery_status px-2.5 py-0.5 inline-block font-medium rounded border bg-green-100 border-green-200 text-green-500 dark:bg-green-500/20 dark:border-green-500/20'>
                                        Đang hoạt động
                                    </span>
                                ) : (
                                    <span className='delivery_status px-2.5 py-0.5 inline-block font-medium rounded border bg-green-100 border-green-200 text-green-500 dark:bg-green-500/20 dark:border-green-500/20'>

                                    </span>
                                )}</td>
                            <td className='border px-2 items-center  flex-1 h-full text-center  flex gap-2 justify-center'>
                                <IoIosLock
                                    color='red'
                                    size={28}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleLockUser(user?.id)}
                                />
                                <IoIosUnlock
                                    color='green'
                                    size={28}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleUnLockUser(user?.id)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>


            <div className="flex justify-center mt-4">
                <Pagination
                    postsPerPage={postsPerPage}
                    totalPosts={filteredUsers.length}
                    currentPage={currentPage}
                    paginate={paginate}
                />
            </div>

            {msg && <p>{msg}</p>}
        </div>
    );
}

export default ManageUser;
