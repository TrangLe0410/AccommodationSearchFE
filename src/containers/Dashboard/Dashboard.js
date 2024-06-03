import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { path } from '../../ultils/constant';
import { Header } from '../Public';
import Sidebar from './Sidebar';

const Dashboard = () => {
    const { isLoggedIn, role } = useSelector(state => state.auth);

    if (!isLoggedIn || role !== 'admin') {
        return <Navigate to={`/${path.LOGIN}`} replace={true} />;
    }

    return (
        <div className='w-full h-screen flex flex-col items-center'>
            <Header />
            <div className='flex w-full flex-auto'>
                <Sidebar />
                <div className='flex-auto bg-color shadow-md p-4' style={{ maxHeight: 'calc(100vh - 6rem)', overflowY: 'auto' }}> {/* Thêm maxHeight và overflowY */}
                    <Outlet />

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
