import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { path } from '../../ultils/constant'
import { Header } from '../Public'
import { Sidebar } from './'
import { getAllUser, getCurrent } from '../../store/actions'
const System = () => {
    const dispatch = useDispatch();
    const { isLoggedIn } = useSelector(state => state.auth)
    const { currentData } = useSelector(state => state.user);
    useEffect(() => {
        dispatch(getCurrent());
    }, [dispatch]);


    if (!isLoggedIn) return <Navigate to={`/${path.LOGIN}`} replace={true} />
    return (
        <div className='w-full h-screen flex flex-col items-center'>
            <Header />
            <div className='flex w-full h-screen flex-auto'>
                <Sidebar />
                <div className='flex-auto bg-white shadow-md h-full p-4 overflow-y-scroll'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default System