import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../store/actions';
import Pagination from './Pagination'; // Import Pagination component
import icons from '../../ultils/icons';
const { MdDeleteForever } = icons;
const ManageUser = () => {
    const dispatch = useDispatch();
    const { users, msg } = useSelector(state => state.user); // Destructure users and msg from state
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5); // Number of users per page
    const [roleFilter, setRoleFilter] = useState(0); // State to store selected role filter

    useEffect(() => {
        dispatch(actions.getAllUser());
    }, [dispatch]);


    const filteredUsers = roleFilter === 0 ? users : users.filter(user => user.role === (roleFilter === 1 ? 'admin' : 'user'));


    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstPost, indexOfLastPost);


    const paginate = pageNumber => setCurrentPage(pageNumber);

    // Handle role filter change
    const handleRoleFilterChange = event => {
        setCurrentPage(1); // Reset current page when role filter changes
        setRoleFilter(parseInt(event.target.value));
    };

    return (
        <div className='flex flex-col gap-6'>
            <div className='py-4 border-b border-gray-200 flex items-center justify-between'>
                <h1 className='text-3xl font-medium'>Người dùng trong hệ thống</h1>
                <select onChange={handleRoleFilterChange} value={roleFilter} className='outline-none border p-2 border-gray-200 rounded-md'>
                    <option value={0}>Tất cả vai trò</option>
                    <option value={1}>Admin</option>
                    <option value={2}>User</option>
                </select>
            </div>

            <table className='w-full table-auto bg-white'>
                {/* Table headers */}
                <thead className='bg-gray-100 '>
                    <tr className='flex w-full'>
                        <th className='border flex-1 p-2'>Id</th>
                        <th className='border flex-1 p-2'>Tên</th>
                        <th className='border flex-1 p-2'>Số điện thoại</th>
                        <th className='border flex-1 p-2'>Zalo</th>
                        <th className='border flex-1 p-2'>Role</th>
                        <th className='border flex-1 p-2'>Tùy chọn</th>
                    </tr>
                </thead>

                <tbody>
                    {currentUsers.map(user => (
                        <tr className='flex h-16 text-sm items-center' key={user.id}>
                            <td className='border px-2 flex-1 h-full text-center '>{user.id}</td>
                            <td className='border px-2 flex-1 h-full text-center'>{user.name}</td>
                            <td className='border px-2 flex-1 h-full text-center'>{user.phone}</td>
                            <td className='border px-2 flex-1 h-full text-center'>{user.zalo}</td>
                            <td className='border px-2 flex-1 h-full text-center' style={{ color: user.role === 'admin' ? 'red' : 'green' }}>{user.role}</td>
                            <td className='border px-2 flex-1 h-full text-center  flex gap-2 justify-center'>
                                <MdDeleteForever
                                    color='red'
                                    size={32}
                                    style={{ cursor: 'pointer' }}
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
