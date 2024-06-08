import React, { useState, useEffect, useRef } from 'react';
import { fetchUserNotifications } from '../services/notification';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments, fetchAppointmentsPoster, getAllUser } from '../store/actions';
import moment from 'moment';

const Notification = ({ socketRef }) => {
    const dispatch = useDispatch();
    const [notifications, setNotifications] = useState([]);
    const [posterInfo, setPosterInfo] = useState(null);
    const [showAll, setShowAll] = useState(false);
    const { appointmentRequesters, appointmentsPosters } = useSelector(state => state.appointments);
    const { currentData, users } = useSelector(state => state.user);

    const notificationListRef = useRef(null);

    useEffect(() => {
        dispatch(getAllUser());
    }, [dispatch]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchUserNotifications();
                setNotifications(data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const appointmentRequesterID = currentData?.id;
        if (appointmentRequesterID) {
            dispatch(fetchAppointments(appointmentRequesterID));
        }
    }, [currentData?.id, dispatch]);

    useEffect(() => {
        const posterId = currentData?.id;
        if (posterId) {
            dispatch(fetchAppointmentsPoster(posterId));
        }
    }, [currentData?.id, dispatch]);

    useEffect(() => {
        if (notifications.length > 0 && users.length > 0) {
            setPosterInfo(null);
            notifications.forEach(notification => {
                const appointment = findAppointment(notification?.appointmentId);
                if (appointment) {
                    const posterId = appointment?.posterId;
                    const poster = findUserById(posterId);
                    setPosterInfo(poster);
                }
            });
        }
    }, [notifications, users]);

    const findAppointment = appointmentId => {
        const allAppointments = [...appointmentRequesters, ...appointmentsPosters];
        return allAppointments.find(appointment => appointment?.id === appointmentId);
    };

    const findUserById = userId => {
        return users.find(user => user?.id === userId);
    };

    useEffect(() => {
        socketRef.current.on('notifications_marked_as_read', (data) => {
            // Handle the event
        });

        return () => {
            socketRef.current.off('notifications_marked_as_read');
        };
    }, []);

    const handleToggleShowAll = () => {
        setShowAll(!showAll);
        // Scroll to the bottom when showing all notifications
        if (!showAll && notificationListRef.current) {
            notificationListRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const displayedNotifications = showAll ? notifications : notifications.slice(0, 5);

    const listHeight = notifications.length > 5 ? 'h-[450px]' : 'h-auto';

    return (
        <div className='w-full absolute right-0'>
            <div className="absolute right-0 mt-11 bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden z-20 w-[20rem]">
                <div className={`py-2 ${listHeight} overflow-auto`} style={{ overflowX: 'hidden' }} ref={notificationListRef}>
                    {displayedNotifications.length > 0 ? (
                        displayedNotifications.map(notification => {
                            const appointment = findAppointment(notification?.appointmentId);
                            const isRequesterNotification = currentData?.id === appointment?.appointmentRequesterID;
                            const isPosterNotification = currentData?.id === appointment?.posterId;
                            const userInfo = isRequesterNotification ? findUserById(appointment?.posterId) : isPosterNotification ? findUserById(appointment?.appointmentRequesterID) : null;

                            return (
                                <div key={notification?.id} className="flex items-center px-4 py-3 border-b hover:bg-gray-100 -mx-2">
                                    {userInfo && (
                                        <img className="h-[38px] w-[38px] rounded-full object-cover mx-1 border-2 border-emerald-400 shadow-emerald-400" src={userInfo?.avatar || 'https://hethongxephangtudong.net/public/client/images/no-avatar.png'} alt="avatar" />
                                    )}
                                    <p className="text-gray-600 text-sm mx-2">
                                        <span>Thông báo từ</span>
                                        <span className="font-bold ml-1">{userInfo?.name}</span> {notification?.content} {appointment ? (
                                            <>
                                                <span className='font-bold text-[#E03C31]'>Thời gian hẹn:</span>
                                                <span> {moment(appointment?.appointmentDate).format('DD/MM/YYYY')} ({appointment?.appointmentTime})</span>
                                            </>
                                        ) : null}
                                    </p>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-gray-600 text-sm mx-2">Không có thông báo nào</p>
                    )}
                </div>
                {notifications.length > 5 && (
                    <button
                        type='button'
                        className='w-full border border-[#0E2E50] outline-none py-2 px-4 rounded-md bg-[#0E2E50] text-base flex items-center justify-center gap-2 text-white font-medium hover:shadow-lg'
                        onClick={handleToggleShowAll}
                    >
                        {showAll ? 'Ẩn bớt' : 'Xem tất cả thông báo'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Notification;
