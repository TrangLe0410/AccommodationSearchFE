import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../store/actions';

const localizer = momentLocalizer(moment);

const CustomEvent = ({ event }) => {
    return (
        <div className='flex items-center justify-center gap-2 '>
            <strong>{event.title}</strong>
            <span>{moment(event.start).format('HH:mm')}</span>
        </div>
    );
};

const CustomCalendar = () => {
    const dispatch = useDispatch();
    const { currentData, users } = useSelector(state => state.user);
    const { posts } = useSelector(state => state.post);
    const { appointmentsPosters } = useSelector(state => state.appointments);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const posterId = currentData?.id;
        if (posterId) {
            dispatch(actions.fetchAppointmentsPoster(posterId));
        }
    }, [currentData?.id, dispatch]);

    useEffect(() => {
        if (appointmentsPosters) {
            const eventsData = appointmentsPosters.map(appointment => {
                const post = posts.find(post => post.id === appointment.postId);
                const requester = users.find(user => user.id === appointment.appointmentRequesterID);

                const appointmentDate = new Date(appointment.appointmentDate);
                const [hours, minutes] = appointment.appointmentTime.split(':');
                appointmentDate.setHours(hours);
                appointmentDate.setMinutes(minutes);

                return {
                    id: appointment.id,
                    title: requester ? requester.name : 'Unknown Title',
                    start: appointmentDate,
                    end: appointmentDate,
                    allDay: false,
                    status: appointment.status,
                    content: appointment.content,
                };
            });
            setEvents(eventsData);
        }
    }, [appointmentsPosters, posts, users]);

    // Hàm trả về thuộc tính CSS dựa trên trạng thái của sự kiện
    const eventStyleGetter = (event) => {
        const style = {
            backgroundColor: '',
            borderRadius: '0px',
            opacity: 0.8,
            color: 'white',
            display: 'block',
            border: 'none',
            padding: '5px'
        };

        switch (event.status) {
            case 'Approved':
                style.backgroundColor = '#28a745'; // Màu xanh lá
                break;
            case 'Canceled':
                style.backgroundColor = '#dc3545'; // Màu đỏ
                break;
            case 'Pending':
                style.backgroundColor = '#ffc107'; // Màu vàng
                style.color = 'black'; // Đổi màu chữ cho dễ đọc
                break;
            default:
                style.backgroundColor = '#6c757d'; // Màu xám mặc định
        }

        return {
            style: style
        };
    };

    return (
        <div className="calendar-container mb-24">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                components={{
                    event: CustomEvent
                }}
                eventPropGetter={eventStyleGetter}
            />
        </div>
    );
};

export default CustomCalendar;
