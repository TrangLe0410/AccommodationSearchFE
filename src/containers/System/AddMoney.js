import React, { useState, useEffect } from 'react';
import axiosConfig from '../../axiosConfig';
import { GiPayMoney } from "react-icons/gi";
import { MdOutlinePayment } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { getCurrent } from '../../store/actions';
import { useNavigate, useLocation } from 'react-router-dom';

const AddMoney = () => {
    const topUpOptions = [
        { amount: 10000, label: '10,000 VND' },
        { amount: 20000, label: '20,000 VND' },
        { amount: 50000, label: '50,000 VND' },
        { amount: 100000, label: '100,000 VND' },
        { amount: 200000, label: '200,000 VND' },
    ];

    const [selectedAmount, setSelectedAmount] = useState(null);
    const [customAmount, setCustomAmount] = useState('');
    const { search } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentData } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(getCurrent());
    }, [dispatch]);

    const handleSelectAmount = (amount) => {
        setSelectedAmount(amount);
        setCustomAmount('');
    };

    const handleCustomAmountChange = (event) => {
        setCustomAmount(event.target.value);
        setSelectedAmount(null);
    };

    const handlePay = async () => {
        try {
            const amountToPay = selectedAmount || parseInt(customAmount, 10);
            if (!amountToPay) {
                alert('Vui lòng chọn hoặc nhập số tiền cần nạp!');
                return;
            }

            const response = await axiosConfig.post('/api/v1/payment/create-checkout-session', { price: amountToPay });
            window.location.href = response.data.url;
        } catch (error) {
            console.error("Error creating checkout session:", error);
        }
    };
    const [statusMessage, setStatusMessage] = useState('');

    const handlePaymentSuccess = async (session_id) => {
        try {
            const response = await axiosConfig.post('/api/v1/payment/payment-success', { session_id });
            if (response.data.success) {
                setStatusMessage('Thanh toán thành công và số dư đã được cập nhật.');
                dispatch(getCurrent());
                setTimeout(() => {
                    setStatusMessage('');
                    // Reset URL về lại /he-thong/nap-tien mà không tải lại trang
                    window.history.replaceState(null, '', '/he-thong/nap-tien');
                }, 1000); // Đợi 3 giây trước khi xóa thông báo và reset URL
            } else {
                setStatusMessage('Có lỗi xảy ra khi cập nhật số dư.');
            }
        } catch (error) {
            console.error("Error updating balance:", error);
            setStatusMessage('Có lỗi xảy ra khi cập nhật số dư.');
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(search);
        const sessionId = urlParams.get('session_id');
        const success = urlParams.get('success');

        if (success === 'true' && sessionId) {
            handlePaymentSuccess(sessionId);
        }
    }, [search]);


    const navigateToHistory = () => {
        navigate('/he-thong/lich-su-nap-tien');
    };

    return (
        <div>
            <h1 className='text-3xl font-medium border-b border-gray-200'>Nạp tiền</h1>
            <div className='w-full flex mt-10'>
                <div className='w-[60%]'>
                    <h2 className='text-[24px]'>Chọn mệnh giá nạp tiền:</h2>
                    <ul className='flex items-center gap-5 mt-5'>
                        {topUpOptions.map((option, index) => (
                            <li key={index}>
                                <label>
                                    <input
                                        className='mr-2'
                                        type="radio"
                                        name="topup"
                                        value={option.amount}
                                        checked={selectedAmount === option.amount}
                                        onChange={() => handleSelectAmount(option.amount)}
                                    />
                                    {option.label}
                                </label>
                            </li>
                        ))}
                    </ul>

                    <div className='mt-5'>
                        <label className='block mb-2'>Hoặc nhập số tiền tùy chỉnh:</label>
                        <input
                            type="number"
                            className='border p-2 rounded w-full'
                            value={customAmount}
                            onChange={handleCustomAmountChange}
                            placeholder="Nhập số tiền cần nạp"
                        />
                    </div>

                    <button className='w-[150px] h-[30px] rounded-sm mt-4 text-center text-white items-center border border-green-600 bg-green-600' onClick={handlePay}>Thanh toán</button>
                </div>

                <div className='w-[40%] ml-28'>
                    <h2 className='text-[18px]'>Số dư tài khoản</h2>
                    <h3 className='text-[24px] text-green-600 font-bold'>{currentData?.balance}đ</h3>
                    <button
                        type='button'
                        className='w-1/2 outline-none mt-8 py-2 px-4 rounded-md bg-[#0E2E50] text-base flex items-center justify-center gap-2 text-white font-medium hover:shadow-lg'
                        onClick={navigateToHistory}
                    >
                        <GiPayMoney />
                        Lịch sử nạp tiền
                    </button>
                    <button
                        type='button'
                        className='w-1/2 mt-4 outline-none py-2 px-4 rounded-md bg-[#0E2E50] text-base flex items-center justify-center gap-2 text-white font-medium hover:shadow-lg'
                        onClick={() => navigate('/he-thong/lich-su-thanh-toan')}
                    >
                        <MdOutlinePayment color='white' />
                        Lịch sử thanh toán
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddMoney;
