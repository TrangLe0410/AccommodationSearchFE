import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrent } from '../../store/actions';
import { apiPaymentAccountBalance } from '../../services';
import axiosConfig from '../../axiosConfig';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate, useLocation } from 'react-router-dom';
import visa from '../../assets/visa.png';
import jcb from "../../assets/jcb.png";
import momo from "../../assets/momo.png";

const MySwal = withReactContent(Swal);

const PostPayment = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const postId = queryParams.get('postId'); // Lấy postId từ query parameters

    const navigate = useNavigate();
    const [postType, setPostType] = useState('free');
    const [paymentMethod, setPaymentMethod] = useState('accountBalance');
    const { currentData } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const money = currentData?.balance;


    useEffect(() => {
        dispatch(getCurrent());
    }, [dispatch]);

    const handlePostTypeChange = (e) => {
        setPostType(e.target.value);
    };

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const getPrice = () => {
        return postType === 'free' ? '0đ' : '20,000đ';
    };

    const handlePayment = async () => {
        const amount = postType === 'free' ? 0 : 20000;
        const paymentData = { amount, postId, typePost: postType };

        if (paymentMethod === 'accountBalance') {
            if (money >= amount) {
                try {
                    const response = await apiPaymentAccountBalance(paymentData);
                    MySwal.fire({
                        title: 'Thành công!',
                        text: 'Thanh toán thành công!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                    dispatch(getCurrent());
                    navigate(`/he-thong/quan-ly-bai-dang`);
                } catch (error) {
                    console.error('Error processing account balance payment:', error);
                    MySwal.fire({
                        title: 'Lỗi!',
                        text: 'Có lỗi xảy ra trong quá trình thanh toán.',
                        icon: 'error',
                        confirmButtonText: 'Đóng'
                    });
                }
            } else {
                MySwal.fire({
                    title: 'Thông báo!',
                    text: 'Số dư tài khoản không đủ.',
                    icon: 'warning',
                    confirmButtonText: 'Đóng'
                });
            }
        } else if (paymentMethod === 'creditCard') {
            try {
                const response = await axiosConfig.post('/api/v1/payment/payment-credit-card', paymentData);
                window.location.href = response.data.url;
            } catch (error) {
                console.error('Error creating checkout session:', error);
                MySwal.fire({
                    title: 'Lỗi!',
                    text: 'Có lỗi xảy ra trong quá trình thanh toán.',
                    icon: 'error',
                    confirmButtonText: 'Đóng'
                });
            }
        } else if (paymentMethod === 'bankTransfer') {
            MySwal.fire({
                title: 'Chức năng chưa triển khai!',
                text: 'Ví điện tử chưa được triển khai.',
                icon: 'info',
                confirmButtonText: 'Đóng'
            });
        }
    };




    return (
        <div>
            <h1 className='text-3xl font-medium border-b mt-2 border-gray-200'>Thanh toán tin đăng</h1>
            <div className='w-full flex mt-10'>
                <div className='w-[60%]'>
                    <h2 className='text-2xl text-red-700'>Cho thuê phòng trọ chất lượng cao</h2>
                    <div className='mt-4'>
                        <label htmlFor="post-type" className='block font-medium'>Chọn loại tin:</label>
                        <select
                            id="post-type"
                            value={postType}
                            onChange={handlePostTypeChange}
                            className='mt-2 p-2 border border-gray-300 rounded-md w-[250px]'
                        >
                            <option value="free">Tin miễn phí (0đ)</option>
                            <option value="priority">Tin đăng ưu tiên (20.000đ)</option>
                        </select>
                    </div>

                    <div className='mt-6'>
                        <label className='block font-medium'>Chọn phương thức thanh toán:</label>
                        <div className='mt-2'>
                            <label className='inline-flex items-center'>
                                <input
                                    type="radio"
                                    value="accountBalance"
                                    checked={paymentMethod === 'accountBalance'}
                                    onChange={handlePaymentMethodChange}
                                    className='form-radio'
                                />
                                <span className='ml-2'>Trừ vào số dư tài khoản ({money ? `${money}đ` : '0đ'})</span>
                            </label>
                            {postType !== 'free' && money < 20000 && (
                                <div className='ml-5 text-red-600 text-sm w-[65%]'>
                                    Số tiền trong tài khoản của bạn không đủ để thực hiện thanh toán, vui lòng nạp thêm hoặc chọn phương thức khác bên dưới
                                </div>
                            )}
                        </div>
                        <div className='mt-2'>
                            <label className='inline-flex items-center'>
                                <input
                                    type="radio"
                                    value="creditCard"
                                    checked={paymentMethod === 'creditCard'}
                                    onChange={handlePaymentMethodChange}
                                    className='form-radio'
                                />
                                <span className='ml-2'>Thẻ tín dụng/Ghi nợ</span>
                            </label>
                            <div className='flex items-center gap-2 ml-4'>

                                <div className='border mt-2 border-gray-300 rounded-md w-16 h-8 bg-gray-100 flex justify-center items-center'>
                                    <img src={visa} alt='visa' className='w-12 object-cover' />
                                </div>
                                <div className='border mt-2 border-gray-300 rounded-md w-16 h-8 bg-gray-100 flex justify-center items-center'>
                                    <img src={jcb} alt='jcb' className='w-12 h-6 object-cover' />
                                </div>
                            </div>
                        </div>
                        <div className='mt-2'>
                            <label className='inline-flex items-center'>
                                <input
                                    type="radio"
                                    value="bankTransfer"
                                    checked={paymentMethod === 'bankTransfer'}
                                    onChange={handlePaymentMethodChange}
                                    className='form-radio'
                                />
                                <span className='ml-2'>Ví điện tử</span>
                            </label>
                            <div className='flex items-center gap-2 ml-4'>
                                <div className='border mt-2 border-gray-300 rounded-md w-16 h-8 bg-gray-100 flex justify-center items-center'>
                                    <img src={momo} alt='momo' className='w-12 object-cover' />
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center gap-5 justify-center mt-6'>
                            <button
                                type='button'
                                className='w-1/2 outline-none py-2 px-4 rounded-md bg-gray-600 text-base flex items-center justify-center gap-2 text-white font-medium hover:shadow-lg'
                                onClick={() => window.history.back()}
                            >
                                Quay lại
                            </button>
                            <button
                                type='button'
                                className='w-1/2 outline-none py-2 px-4 rounded-md bg-green-600 text-base flex items-center justify-center gap-2 text-white font-medium hover:shadow-lg'
                                onClick={handlePayment}
                            >
                                Thanh toán ({getPrice()})
                            </button>
                        </div>
                    </div>
                </div>
                <div className='w-[35%] flex-none pt-10'>
                    <div className='border p-3 text-justify border-gray-300 rounded-md'>
                        <p className='text-lg font-semibold'>Thông tin thanh toán</p>
                        <div className='flex mt-4 border-t border-b h-12 items-center border-gray-300 bg-gray-200'>
                            <p className='flex-1 ml-3'>Bạn đang có</p>
                            <p className='flex-1 ml-4'>{money ? `${money}đ` : '0đ'}</p>
                        </div>
                        <div className='flex h-12 items-center border-gray-300'>
                            <p className='flex-1 ml-3'>Loại tin</p>
                            <p className='flex-1 ml-4'>{postType === 'free' ? 'Tin miễn phí' : 'Tin đăng ưu tiên'}</p>
                        </div>
                        <div className='flex border-t border-b h-12 items-center border-gray-300 bg-gray-200'>
                            <p className='flex-1 ml-3'>Đơn giá</p>
                            <p className='flex-1 ml-4'>{postType === 'free' ? '0đ' : '20,000đ'}</p>
                        </div>
                        <div className='flex h-12 items-center border-gray-300'>
                            <p className='flex-1 ml-3'>Thành tiền</p>
                            <p className='flex-1 text-3xl font-bold text-red-600 ml-4'>{postType === 'free' ? '0đ' : '20,000đ'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostPayment;