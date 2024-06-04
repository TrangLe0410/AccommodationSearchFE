import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getMarkedPosts, getRelatedPosts } from '../../store/actions';
import { CardItem } from '../../components';


const SavedPost = () => {
    const dispatch = useDispatch();
    const { currentData } = useSelector(state => state.user);
    const { markedPosts } = useSelector(state => state.post.markedPosts);
    const userId = currentData?.id;

    useEffect(() => {
        dispatch(getMarkedPosts(userId));
    }, [dispatch, userId]);

    return (
        <div>
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-3xl text-[#0E2E50] mb-2 my-4">Bài đăng bạn đã lưu</h3>
            </div>
            <div className="flex flex-wrap gap-4 mt-4 mb-8">
                {markedPosts && markedPosts.map(item => (
                    <CardItem
                        id={item?.post?.id} // <-- Here's the id being passed
                        title={item?.post?.title}
                        address={item?.post?.address}
                        price={item?.post?.attributes?.price}
                        acreage={item?.post?.attributes?.acreage}
                        image={JSON.parse(item?.post?.images?.image)}
                        description={JSON.parse(item?.post?.description)}
                        star={item?.post?.star}
                    />
                ))}
            </div>
        </div>
    );
};

export default SavedPost;
