import React, { useEffect, useState } from 'react';
import Header from './Header'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import * as actions from '../../store/actions'
import { Chat } from '.';
const Home = () => {
    const dispatch = useDispatch()
    const { isLoggedIn } = useSelector(state => state.auth)


    useEffect(() => {
        setTimeout(() => {
            isLoggedIn && dispatch(actions.getCurrent())
        }, 1000)
    }, [isLoggedIn])

    return (
        <div className='w-full flex gap-6 flex-col items-center h-full'>
            <Header />
            <div className='w-4/5 lg:w-4/5 flex flex-col items-start justify-start'>
                <Outlet />
            </div>
            <Footer />

        </div>
    );
}
export default Home;