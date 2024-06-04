import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getRelatedPosts } from '../../store/actions';
import { CardItem } from '../../components';
import icons from '../../ultils/icons';
const { FaChevronRight, FaChevronLeft } = icons;

const ListCardItem = () => {
    const dispatch = useDispatch();
    const { postId } = useParams();
    const { relatedPosts } = useSelector(state => state.post);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [displayedPosts, setDisplayedPosts] = useState([]);

    useEffect(() => {
        // Reset relatedPosts to an empty array when postId changes
        dispatch(getRelatedPosts(postId));
    }, [postId]);

    useEffect(() => {
        if (relatedPosts.length > 0) {
            let nextPosts = [];
            const numSlides = Math.ceil(relatedPosts.length / 3);
            const startIndex = currentSlide * 3;
            const endIndex = Math.min(startIndex + 3, relatedPosts.length);

            for (let i = startIndex; i < endIndex; i++) {
                nextPosts.push(relatedPosts[i]);
            }

            setDisplayedPosts(nextPosts);
        } else {
            // If relatedPosts is empty, reset displayedPosts
            setDisplayedPosts([]);
        }
    }, [currentSlide, relatedPosts]);

    console.log(relatedPosts)

    const nextSlide = () => {
        const numSlides = Math.ceil(relatedPosts.length / 3);
        setCurrentSlide(prev => (prev + 1) % numSlides);
    };

    const prevSlide = () => {
        const numSlides = Math.ceil(relatedPosts.length / 3);
        setCurrentSlide(prev => (prev - 1 + numSlides) % numSlides);
    };

    return (
        <div >
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-3xl text-[#0E2E50] mb-2 my-4">Dành cho bạn</h3>
                <div className="flex gap-2">
                    <div className={`text-gray-800 w-[30px] h-[30px] border bg-white border-gray-300 rounded-lg cursor-pointer flex justify-center items-center ${currentSlide === 0 && 'opacity-50 pointer-events-none'}`} onClick={prevSlide}>
                        <FaChevronLeft fontSize={20} />
                    </div>
                    <div className={`text-gray-800 w-[30px] h-[30px] border bg-white border-gray-300 rounded-lg cursor-pointer flex justify-center items-center ${relatedPosts.length <= 3 || currentSlide >= Math.ceil(relatedPosts.length / 3) - 1 && 'opacity-50 pointer-events-none'}`} onClick={nextSlide}>
                        <FaChevronRight fontSize={20} />
                    </div>
                </div>
            </div>
            <div className="flex gap-4 mb-8 justify-between items-center">
                {displayedPosts.map(item => (
                    <CardItem
                        key={item.id}
                        title={item.title}
                        price={item?.attributes?.price}
                        acreage={item?.attributes?.acreage}
                        createdAt={item?.createdAt}
                        image={JSON.parse(item.images.image)}
                        id={item.id} // <-- Here's the id being passed
                        star={item?.star}
                        address={item?.address}
                        description={JSON.parse(item?.description)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ListCardItem;
