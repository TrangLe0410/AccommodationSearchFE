import React, { useEffect, useState } from 'react';
import { apiGetPaymentHistory } from '../../services';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from '../../store/actions';



const PaymentHistory = () => {
    const [paymentHistory, setPaymentHistory] = useState([]);
    useEffect(() => {
        const fetchPaymentHistory = async () => {
            try {
                const data = await apiGetPaymentHistory();
                setPaymentHistory(data.paymentHistory); // Đặt dữ liệu trả về từ API vào state
            } catch (error) {
                console.error("Error fetching transaction history:", error);
            }
        };

        fetchPaymentHistory();
    }, []);
    const dispatch = useDispatch();
    const { posts } = useSelector(state => state.post);
    useEffect(() => {
        dispatch(getPosts());
        return () => {
            dispatch({ type: 'CLEAR_POSTS' });
        };
    }, [dispatch]);

    return (
        <div className='flex flex-col gap-6 mb-3'>
            <h1 className='text-3xl font-medium '>Lịch sử thanh toán</h1>
            <table className='w-full table-auto'>
                <thead className='bg-gray-100'>
                    <tr className='flex w-full'>
                        <th className='border flex-[6%] p-2'>Mã giao dịch</th>
                        <th className='border flex-[1%] p-2'>Hoạt động</th>
                        <th className='border flex-1 p-2'>Mã tin</th>
                        <th className='border flex-1 p-2'>Loại tin</th>
                        <th className='border flex-1 p-2'>Số dư</th>
                        <th className='border flex-1 p-2'>Phí</th>
                        <th className='border flex-1 p-2'>Còn lại</th>
                        <th className='border flex-[4%] p-2'>Loại giao dịch</th>
                        <th className='border flex-[7%] p-2'>Thời gian</th>
                        <th className='border flex-[3%] p-2'>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {paymentHistory.map((payment) => {
                        const post = posts.find(post => post?.id === payment?.postId);

                        return (
                            <tr key={payment.id} className='flex h-14 text-sm items-center justify-center'>
                                <td className='border px-2 flex-[6%] h-full text-center flex justify-center items-center'>{payment?.id}</td>
                                <td className='border px-2 flex-1 h-full text-center flex justify-center items-center '>
                                    <div className='bg-green-600 border-green-600 text-white font-semibold border rounded-sm p-1'>
                                        {payment.typeActive === 'showPost' ? 'Hiển thị lại' : 'Đăng mới'}
                                    </div>
                                </td>

                                <td className='border px-2 flex-1 h-full text-center flex justify-center items-center'>{post?.overviews?.code || 'Loading...'}</td>
                                <td className='border px-2 flex-1 h-full text-center flex justify-center items-center'>
                                    <div
                                        className={`border rounded-sm p-1 text-white font-semibold ${payment?.typePost === 'priority' ? 'bg-yellow-500 border-yellow-500' : 'bg-blue-500 border-blue-500'}`}
                                    >
                                        {payment?.typePost === 'priority' ? 'Tin ưu tiên' : 'Tin thường'}
                                    </div>
                                </td>

                                <td className='border px-2 flex-1 h-full text-center flex justify-center items-center'>{payment?.balanceBeforePayment}đ</td>
                                <td className='border px-2 flex-1 h-full text-center flex justify-center items-center'>{payment?.money}đ</td>
                                <td className='border px-2 flex-1 h-full text-center flex justify-center items-center'>
                                    {payment?.paymentMethod === 'creditCard' ? (
                                        <span>{payment?.balanceBeforePayment}đ</span>
                                    ) : (
                                        <span>{payment?.balanceBeforePayment - payment?.money}đ</span>
                                    )}
                                </td>
                                <td className='border px-2 flex-[4%] h-full text-center flex justify-center items-center'>
                                    {payment?.paymentMethod === 'accountBalance' ? 'Tài khoản chính' : 'Thẻ tín dụng'}
                                </td>
                                <td className='border px-2 flex-[7%] h-full text-center flex justify-center items-center'>{new Date(payment.datetime_transaction).toLocaleString()}</td>
                                <td className='border px-2 flex-[3%] h-full text-center flex justify-center items-center'>{payment?.status}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentHistory;
