
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNewAppointment } from '../../services/appointment';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2'
import { io } from "socket.io-client";
import { fetchAppointments } from '../../store/actions';
const socket = io.connect("http://3.107.49.162:5000");
const Appointment = () => {
    const { postId } = useParams();
    const { posts } = useSelector(state => state.post)
    const { currentData } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const { appointmentRequesters } = useSelector(state => state.appointments);
    const currentPost = posts.find(post => post.id === postId);
    const [formData, setFormData] = useState({
        postId: postId || '',
        posterId: posts[0]?.userId || '',
        name: posts[0]?.user?.name || '',
        phone: posts[0]?.user?.phone || '',
        appointmentDate: '',
        appointmentTime: '',
        content: '',

        appointmentRequesterID: currentData?.id || '',
    });
    useEffect(() => {
        const appointmentRequesterID = currentData?.id;
        if (appointmentRequesterID) {
            dispatch(fetchAppointments(appointmentRequesterID));
        }
    }, [currentData?.id, dispatch]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const today = new Date().toISOString().split('T')[0];

        if (!formData.postId || !formData.name || !formData.phone || !formData.appointmentDate || !formData.appointmentTime || !formData.content) {
            Swal.fire({
                icon: 'error',
                title: 'Vui lòng điền đầy đủ thông tin',
            });
            return;
        }

        if (formData.appointmentDate < today) {
            Swal.fire({
                icon: 'error',
                title: 'Ngày hẹn không hợp lệ!',
            });
            return;
        }

        try {
            const response = await createNewAppointment(formData);

            if (response.status === 201) { // Check for successful response status
                const appointmentNew = response.data.appointmentNew; // Access appointmentNew from successful response



                Swal.fire({
                    icon: 'success',
                    title: 'Lịch hẹn đã được tạo thành công',
                });

                setFormData({
                    name: currentPost?.user?.name || '',
                    postId: '',
                    phone: currentPost?.user?.phone || '',
                    appointmentDate: '',
                    appointmentTime: '',
                    content: ''
                });

                // Access appointmentRequesters here after dispatching fetchAppointments (potentially use in socket emission)
                socket.emit('send_notification', {
                    userId: posts[0]?.userId,
                    content: 'Đã đặt lịch hẹn với bạn',
                    appointmentId: appointmentNew?.id // Consider appropriate handling based on appointmentRequesters update
                });
            } else {
                console.error('API request failed:', response);
                Swal.fire({
                    icon: 'error',
                    title: 'Đã xảy ra lỗi khi tạo lịch hẹn',
                });
            }
        } catch (error) {
            console.error('Đã xảy ra lỗi khi tạo lịch hẹn:', error);
            Swal.fire({
                icon: 'error',
                title: 'Đã xảy ra lỗi khi tạo lịch hẹn',
            });
        }
    };
    return (
        <div>
            <div className="flex items-center justify-center p-12">
                <div className="mx-auto w-full max-w-[550px] bg-white">
                    <h1 className='text-3xl font-medium mb-6'>Đặt lịch hẹn</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <input
                                    value={posts[0]?.user?.name}
                                    onChange={handleChange}
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="Nhập tên"
                                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                />
                            </div>

                            <div className="flex flex-col">
                                <input
                                    value={posts[0]?.user?.phone}
                                    type="text"
                                    name="phone"
                                    id="phone"
                                    placeholder="Số điện thoại"
                                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="appointmentDate" className="mb-3 block text-base font-medium text-[#07074D]">
                                    Ngày hẹn
                                </label>
                                <input
                                    value={formData.appointmentDate}
                                    onChange={handleChange}
                                    type="date"
                                    name="appointmentDate"
                                    id="appointmentDate"
                                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="appointmentTime" className="mb-3 block text-base font-medium text-[#07074D]">
                                    Thời gian
                                </label>
                                <input
                                    value={formData.appointmentTime}
                                    onChange={handleChange}
                                    type="time"
                                    name="appointmentTime"
                                    id="appointmentTime"
                                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                />
                            </div>

                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="content" className="block text-gray-700 font-bold mb-2">
                                Nội dung
                            </label>
                            <textarea
                                value={formData.content}
                                onChange={handleChange}
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                id="content"
                                name="content"
                                rows="4"
                                placeholder="Nhập nội dung"
                            ></textarea>
                        </div>
                        <div>
                            <button type="submit" className="hover:shadow-form w-full mt-5 rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none">
                                Đặt lịch hẹn
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Appointment;
