import React, { useState, useEffect, memo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom'
const images = [
    'https://www.home-designing.com/wp-content/uploads/2019/02/Small-courtyard-design.jpg',
    'https://xuongmocgocongnghiep.com/upload/images/phong-khach-mau-xanh-la-cay-14(1).jpg',
    'https://assets.architecturaldigest.in/photos/62f4d46616c88215b7e80d3b/16:9/w_1615,h_908,c_limit/Step%20into%205%20of%20the%20most%20beautiful%20villas%20in%20Bengaluru.jpg'
];

const Slider = () => {
    const [activeSlide, setActiveSlide] = useState(0);


    const handleSlide = (direction) => {
        const totalSlides = images.length;
        setActiveSlide((prev) =>
            direction === 'prev'
                ? prev === 0
                    ? totalSlides - 1
                    : prev - 1
                : prev === totalSlides - 1
                    ? 0
                    : prev + 1
        );
    };

    const nextSlide = () => {
        handleSlide('next');
    };

    useEffect(() => {
        const intervalId = setInterval(nextSlide, 5000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex items-center justify-center">
            <div
                id="carouselExampleCaptions"
                className="relative w-full h-full overflow-hidden"
                data-te-carousel-init
                data-te-ride="carousel"
            >
                <div className="absolute bottom-0 left-0 right-0 z-[2] mb-4 flex list-none justify-center p-0">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            data-te-target="#carouselExampleCaptions"
                            data-te-slide-to={index}
                            className={`mx-[3px] box-content h-[3px] w-[30px] flex-initial cursor-pointer border-0 border-y-[10px] border-solid border-transparent bg-white bg-clip-padding p-0 -indent-[999px] opacity-50 transition-opacity duration-[600ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] motion-reduce:transition-none ${index === activeSlide ? 'opacity-100' : ''
                                }`}
                            aria-current={index === activeSlide}
                            aria-label={`Slide ${index + 1}`}
                        ></button>
                    ))}
                </div>

                <div className="relative w-full h-[450px] object-cover">
                    {images.map((url, index) => (
                        <div
                            key={index}
                            className={`relative float-left -mr-[100%] w-full ${index === activeSlide ? 'h-full' : 'hidden'
                                } transition-transform duration-[600ms] ease-in-out motion-reduce:transition-none`}
                            data-te-carousel-active
                            data-te-carousel-item
                        >
                            <img
                                src={url}
                                className="object-cover w-full h-full"
                                alt={`Slide ${index + 1}`}
                            />
                        </div>
                    ))}
                </div>

                <button
                    className="absolute bottom-0 left-0 top-0 z-[1] flex w-[15%] items-center justify-center border-0 bg-none p-0 text-center text-white opacity-50 transition-opacity duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:text-white hover:no-underline hover:opacity-90 hover:outline-none focus:text-white focus:no-underline focus:opacity-90 focus:outline-none motion-reduce:transition-none"
                    type="button"
                    data-te-target="#carouselExampleCaptions"
                    data-te-slide="prev"
                    onClick={() => handleSlide('prev')}
                >
                    {/* ... existing code ... */}
                </button>

                <button
                    className="absolute bottom-0 right-0 top-0 z-[1] flex w-[15%] items-center justify-center border-0 bg-none p-0 text-center text-white opacity-50 transition-opacity duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:text-white hover:no-underline hover:opacity-90 hover:outline-none focus:text-white focus:no-underline focus:opacity-90 focus:outline-none motion-reduce:transition-none"
                    type="button"
                    data-te-target="#carouselExampleCaptions"
                    data-te-slide="next"
                    onClick={() => handleSlide('next')}
                >
                    {/* ... existing code ... */}
                </button>
            </div>
        </div>
    );
};

export default memo(Slider);
