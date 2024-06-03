import React, { memo, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ProvinceBtn } from './index';
import { location } from '../ultils/constant';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../store/actions';

const Province = () => {
    const headerRef = useRef();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        headerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [searchParams.get('page')]);

    const dispatch = useDispatch();
    const { provinces } = useSelector((state) => state.app);

    useEffect(() => {
        dispatch(actions.getProvinces());
    }, []);

    const handleProvinceClick = (code) => {
        const searchParams = new URLSearchParams();
        searchParams.set('provinceCode', code);

        // You can customize this URL based on your routing structure
        const searchUrl = `/tim-kiem?${searchParams.toString()}`;
        navigate(searchUrl);
    };

    return (
        <div>
            {/* <h1 className='font-semibold text-center text-lg text-[#0E2E50]'>Tìm kiếm theo quận</h1> */}
            <div ref={headerRef} className='flex items-center gap-5 justify-center py-5'>
                {location.map((item) => {
                    return (
                        <ProvinceBtn
                            key={item.id}
                            image={item.image}
                            name={item.name}
                            onClick={() => handleProvinceClick(item.code)}
                        />
                    );
                })}
            </div>
        </div>


    );
};

export default memo(Province);
