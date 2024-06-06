import React, { useEffect, useState } from 'react';
import { apiGetTransactionHistory } from '../../services';


const MoneyAddHistory = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactionHistory = async () => {
            try {
                const data = await apiGetTransactionHistory();
                setTransactions(data.transactions); // Đặt dữ liệu trả về từ API vào state
            } catch (error) {
                console.error("Error fetching transaction history:", error);
            }
        };

        fetchTransactionHistory();
    }, []);

    return (
        <div className='flex flex-col gap-6 mb-3'>
            <h1 className='text-3xl font-medium '>Lịch sử nạp tiền</h1>
            <table className='w-full table-auto'>
                <thead className='bg-gray-100'>
                    <tr className='flex w-full'>
                        <th className='border flex-1 p-2'>Mã giao dịch</th>
                        <th className='border flex-1 p-2'>Số tiền nộp vào</th>
                        <th className='border flex-1 p-2'>Nội dung giao dịch</th>
                        <th className='border flex-1 p-2'>Thời gian giao dịch</th>
                        <th className='border flex-1 p-2'>Trạng thái giao dịch</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.id} className='flex h-10 text-sm items-center justify-center'>
                            <td className='border px-2 flex-1 h-full text-center flex justify-center items-center'>{transaction.id}</td>
                            <td className='border px-2 flex-1 h-full text-center flex justify-center items-center'>{transaction.money}đ</td>
                            <td className='border px-2 flex-1 h-full text-center flex justify-center items-center'>{transaction.content_transaction}</td>
                            <td className='border px-2 flex-1 h-full text-center flex justify-center items-center'>{new Date(transaction.datetime_transaction).toLocaleString()}</td>
                            <td className='border px-2 flex-1 h-full text-center flex justify-center items-center'>
                                <span className={transaction.status_transaction ? 'text-green-600' : 'text-red-600'}>
                                    {transaction.status_transaction ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MoneyAddHistory;
