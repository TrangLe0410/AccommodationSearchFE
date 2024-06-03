import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../store/actions';
import { Sitem } from './index';

const NewPost = ({ newPost }) => {
    const { newPosts, starPosts } = useSelector(state => state.post);
    const dispatch = useDispatch();
    const [posts, setPosts] = useState([]);


    useEffect(() => {
        newPost ? dispatch(actions.getNewPosts()) : dispatch(actions.getPostsByStar());
    }, [dispatch, newPost]);

    useEffect(() => {
        newPost ? setPosts(newPosts) : setPosts(starPosts);
    }, [newPosts, starPosts]);

    return (
        <div className='w-full bg-white rounded-md p-4'>
            <h3 className='font-semibold mb-4 text-xl'>{newPost ? 'Tin mới đăng' : 'Tin nổi bật'}</h3>
            <div className='w-full flex flex-col gap-2'>
                {posts?.length > 0 && posts
                    .filter(item => item.status === 'Approved' && item.visibility === 'Visible')
                    .map(item => (
                        <Sitem
                            key={item.id}
                            title={item.title}
                            price={item?.attributes?.price}
                            createdAt={item.createdAt}
                            image={JSON.parse(item.images.image)}
                            id={item.id}
                            star={item.star}
                        />
                    ))}
            </div>
        </div>
    );
};

export default NewPost;