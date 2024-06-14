import React, { useEffect, useState } from 'react';
import { Button, Item } from '../../components';
import { getPosts, getPostsLimit } from '../../store/actions/post';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { apiGetAllPaymentHistory, apiGetPosts } from '../../services';

const List = ({ categoryCode }) => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const { posts } = useSelector(state => state.post);
    const [sort, setSort] = useState(1);
    const [paymentHistories, setPaymentHistoryAll] = useState([]);
    const [allPosts, setAllPosts] = useState([]);
    const [isDefaultSort, setIsDefaultSort] = useState(true);

    useEffect(() => {
        const fetchPaymentHistoryAll = async () => {
            try {
                const data = await apiGetAllPaymentHistory();
                setPaymentHistoryAll(data.paymentHistories); // Đặt dữ liệu trả về từ API vào state


            } catch (error) {
                console.error("Error fetching transaction history:", error);
            }
        };

        fetchPaymentHistoryAll();
    }, [dispatch]);
    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                const response = await apiGetPosts();
                setAllPosts(response.data.response || []);
            } catch (error) {
                console.error("Error fetching all posts:", error);
            }
        };

        fetchAllPosts();
    }, []);

    useEffect(() => {
        let params = [];
        for (let entry of searchParams.entries()) {
            params.push(entry);
        }
        let searchParamsObject = {};
        params?.forEach(i => {
            if (Object.keys(searchParamsObject)?.some(item => item === i[0])) {
                searchParamsObject[i[0]] = [...searchParamsObject[i[0]], i[1]];
            } else {
                searchParamsObject = { ...searchParamsObject, [i[0]]: [i[1]] };
            }
        });
        if (categoryCode) searchParamsObject.categoryCode = categoryCode;
        if (sort === 1) {

        } else if (sort === 2) {
            searchParamsObject.order = ['createdAt', 'DESC'];
        }
        dispatch(getPostsLimit(searchParamsObject));
    }, [searchParams, categoryCode, sort, dispatch]);

    const prioritizedPosts = allPosts.filter(post =>
        paymentHistories.some(history =>
            history.postId === post.id && history.status === 'Đã thanh toán' && history.typePost === 'priority'
        )
    );
    const regularPosts = posts.filter(post =>
        !(paymentHistories.some(history =>
            history.postId === post.id && history.status === 'Đã thanh toán' && history.typePost === 'priority'
        ))
    );
    const finalPosts = [...prioritizedPosts, ...regularPosts].filter(post =>
        post.status === 'Approved' && post.visibility === 'Visible'
    );

    return (
        <div className='w-full bg-white shadow-sm rounded-md border border-gray-300 p-6 items-start'>
            <div className='flex items-center justify-between'>
                <h4 className='text-3xl text-[#0E2E50] font-semibold'>Danh sách bài đăng</h4>
                <div className='flex items-center gap-2 my-1'>
                    <div className='flex items-center gap-2 my-1'>
                        <span
                            onClick={() => {
                                setSort(1);
                                setIsDefaultSort(true); // Sắp xếp theo mặc định
                            }}
                            className={`border p-1 rounded-md cursor-pointer ${sort === 1 ? 'bg-[#00B98E] border-[#00B98E] text-white' : 'bg-white border-[#00B98E] text-[#0e2e50] hover:bg-[#00B98E] hover:text-white'}`}
                        >
                            Mặc định
                        </span>
                        <span
                            onClick={() => {
                                setSort(2);
                                setIsDefaultSort(false); // Sắp xếp theo mới nhất
                            }}
                            className={`border p-1 rounded-md cursor-pointer ${sort === 2 ? 'bg-[#00B98E] border-[#00B98E] text-white' : 'bg-white border-[#00B98E] text-[#0e2e50] hover:bg-[#00B98E] hover:text-white'}`}
                        >
                            Mới nhất
                        </span>
                    </div>
                </div>
            </div>

            <div className='items mt-6'>
                {isDefaultSort ? ( // Sử dụng state để quyết định việc hiển thị
                    finalPosts.length > 0 && finalPosts.map(item => (
                        <Item
                            key={item?.id}
                            address={item?.address}
                            attributes={item?.attributes}
                            description={JSON.parse(item?.description)}
                            images={JSON.parse(item?.images?.image)}
                            star={+item?.star}
                            title={item?.title}
                            user={item?.user}
                            id={item?.id}
                        />
                    ))
                ) : (
                    posts?.length > 0 && posts
                        .filter(item => item.status === 'Approved' && item.visibility === 'Visible') // Lọc ra những bài đăng có status là "Approved"
                        .map(item => (
                            <Item
                                key={item?.id}
                                address={item?.address}
                                attributes={item?.attributes}
                                description={JSON.parse(item?.description)}
                                images={JSON.parse(item?.images?.image)}
                                star={+item?.star}
                                title={item?.title}
                                user={item?.user}
                                id={item?.id}
                            />
                        ))
                )}
            </div>
        </div>
    );

};

export default List;