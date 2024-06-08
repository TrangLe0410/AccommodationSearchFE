import React, { memo } from 'react'
import Slider from 'react-slick';

const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
};

const SliderPost = ({ images, video }) => {
    return (
        <div className='w-full'>
            <Slider {...settings}>
                {images?.length > 0 && images?.map((item, index) => {
                    return (
                        <div key={index} className='bg-black flex justify-center h-[320px] px-12'>
                            <img
                                src={item}
                                alt="slider"
                                className='object-contain m-auto h-full' />
                        </div>
                    )
                })}
                {video && (
                    <div className='bg-black flex justify-center h-[320px] px-12'>
                        <video controls className='object-contain m-auto h-full'>
                            <source src={video} type="video/mp4" />
                        </video>
                    </div>
                )}
            </Slider>
        </div>
    )
}

export default memo(SliderPost)
