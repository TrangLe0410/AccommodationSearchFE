import React, { useEffect, useState } from 'react'
import { Overview, Address, Loading, Button, Map } from '../../components'
import { apiUpdatePost, apiUploadImages, apiUploadVideo } from '../../services'
import icons from '../../ultils/icons'
import { getCodes, getCodesArea } from '../../ultils/Common/getCodes'
import { useDispatch, useSelector } from 'react-redux'
import { apiCreatePost } from '../../services'
import Swal from 'sweetalert2'
import validate from '../../ultils/Common/validateFields'
import { UseDispatch } from 'react-redux'
import { resetDataEdit } from '../../store/actions'
import { useNavigate } from 'react-router-dom';
import MapBox from '../../components/MapBox'
import { FaVideo } from "react-icons/fa";
const { BsCameraFill, ImBin } = icons

const CreatePost = ({ isEdit }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch()

    const { dataEdit } = useSelector(state => state.post)
    console.log(dataEdit?.video)


    const [payload, setPayload] = useState(() => {
        const initData = {
            categoryCode: dataEdit?.categoryCode || '',
            title: dataEdit?.title || '',
            priceNumber: dataEdit?.priceNumber * 1000000 || 0,
            areaNumber: dataEdit?.areaNumber || 0,
            images: dataEdit?.images?.image ? JSON.parse(dataEdit?.images?.image) : '',
            address: dataEdit?.address || '',
            priceCode: dataEdit?.priceCode || '',
            areaCode: dataEdit?.areaCode || '',
            description: dataEdit?.description ? JSON.parse(dataEdit?.description) : '',
            target: dataEdit?.overviews?.target || '',
            province: dataEdit?.province || '',
            video: dataEdit?.video || '',
        }
        return initData
    })

    const [imagesPreview, setImagesPreview] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const { prices, areas, categories, provinces } = useSelector(state => state.app)
    const { currentData } = useSelector(state => state.user)
    const [invalidFields, setInvalidFields] = useState([])
    const [videoPreview, setVideoPreview] = useState(null);

    useEffect(() => {
        if (dataEdit) {
            setVideoPreview(dataEdit?.video);
        }
    }, [dataEdit]);

    useEffect(() => {
        if (dataEdit) {
            let images = JSON.parse(dataEdit?.images?.image)
            images && setImagesPreview(images)
        }
    }, [dataEdit])


    const handleFiles = async (e) => {
        e.stopPropagation()
        setIsLoading(true)
        let images = []
        let files = e.target.files
        let formData = new FormData()
        for (let i of files) {
            formData.append('file', i)
            formData.append('upload_preset', process.env.REACT_APP_UPLOAD_ASSETS_NAME)
            let response = await apiUploadImages(formData)
            if (response.status === 200) images = [...images, response.data?.secure_url]
        }
        setIsLoading(false)
        setImagesPreview(prev => [...prev, ...images])
        setPayload(prev => ({ ...prev, images: [...prev.images, ...images] }))
    }
    const handleDeleteImage = (image) => {
        setImagesPreview(prev => prev?.filter(item => item !== image))
        setPayload(prev => ({
            ...prev,
            images: prev.images?.filter(item => item !== image)
        }))
    }

    const handleDeleteVideo = () => {
        setVideoPreview(null);
        setPayload(prev => ({ ...prev, video: '' }));
    };
    const handleSubmit = async () => {
        const descriptionArray = Array.isArray(payload.description) ? payload.description : payload.description.split('\n').filter(item => item.trim() !== "")

        let priceCodeArr = getCodes(+payload.priceNumber / Math.pow(10, 6), prices, 1, 15)
        let priceCode = priceCodeArr[0]?.code
        let areaCodeArr = getCodesArea(+payload.areaNumber, areas, 0, 90)
        let areaCode = areaCodeArr[0]?.code

        let finalPayload = {
            ...payload,
            priceCode,
            areaCode,
            userId: currentData.id,
            priceNumber: +payload.priceNumber / Math.pow(10, 6),
            areaNumber: +payload.areaNumber,
            target: payload.target || 'Tất cả',
            label: `${categories?.find(item => item.code === payload?.categoryCode)?.value} ${payload?.address?.split(',')[2]}`,
            // description: JSON.stringify(payload.description)
            description: descriptionArray,
            video: videoPreview,

        }



        const result = validate(finalPayload, setInvalidFields)
        if (result === 0) {
            if (dataEdit) {
                finalPayload.postId = dataEdit?.id
                finalPayload.attributesId = dataEdit?.attributesId
                finalPayload.imagesId = dataEdit?.imagesId
                finalPayload.overviewId = dataEdit?.overviewId
                const response = await apiUpdatePost(finalPayload)
                if (response?.data.err === 0) {
                    Swal.fire('Thành công', 'Cập nhật bài đăng thành công', 'success').then(() => {
                        resetPayload()
                        dispatch(resetDataEdit())
                    })

                } else {
                    Swal.fire('Oops!', 'Cập nhật thất bại', 'error')
                }
            } else {
                const response = await apiCreatePost(finalPayload)
                if (response?.data.err === 0) {
                    Swal.fire('Thành công', 'Tạo bài đăng thành công', 'success').then(() => {
                        resetPayload()
                        navigate('/he-thong/quan-ly-bai-dang');
                    })
                } else {
                    Swal.fire('Oops!', 'Tạo mới thất bại', 'error')
                }

            }


        }
    }

    const resetPayload = () => {
        setPayload({
            categoryCode: '',
            title: '',
            priceNumber: 0,
            areaNumber: 0,
            images: [],
            address: '',
            priceCode: '',
            areaCode: '',
            description: [],
            target: '',
            province: '',
            video: '',
        });
        setImagesPreview([]);
    }
    useEffect(() => {
        if (!isEdit) {
            resetPayload();
        }
    }, [isEdit]);

    const [isVideoUploading, setIsVideoUploading] = useState(false);

    const handleVideoUpload = async (e) => {
        e.stopPropagation();
        setIsVideoUploading(true); // Bắt đầu hiển thị biểu tượng loading chỉ ở phần video
        let video = e.target.files[0];
        let formData = new FormData();
        formData.append('file', video);
        formData.append('upload_preset', process.env.REACT_APP_UPLOAD_ASSETS_NAME);

        try {
            const response = await apiUploadVideo(formData);
            if (response.status === 200) {
                const videoUrl = response.data.secure_url;
                setPayload(prev => ({ ...prev, videoUrl }));
                setVideoPreview(videoUrl);
            } else {
                // Xử lý lỗi nếu upload không thành công
                console.error("Error uploading video");
            }
        } catch (error) {
            // Xử lý lỗi nếu có lỗi trong quá trình upload
            console.error("Error uploading video:", error);
        }

        setIsVideoUploading(false); // Kết thúc hiển thị biểu tượng loading chỉ ở phần video
    };



    return (
        <div className='px-6'>
            <h1 className='text-3xl font-medium py-4 border-b border-gray-200'>{isEdit ? 'Chỉnh sửa tin đăng' : 'Đăng tin mới'}</h1>
            <div className='flex gap-4'>
                <div className='py-4 flex flex-col gap-8 flex-auto'>
                    <Address isEdit={isEdit} invalidFields={invalidFields} setInvalidFields={setInvalidFields} payload={payload} setPayload={setPayload} />
                    <Overview invalidFields={invalidFields} setInvalidFields={setInvalidFields} payload={payload} setPayload={setPayload} />
                    <div className='w-full mb-6'>
                        <h2 className='font-semibold text-xl py-4'>Hình ảnh</h2>
                        <small>Cập nhật hình ảnh rõ ràng sẽ cho thuê nhanh hơn</small>
                        <div className='w-full'>
                            <label className='w-full border-2 h-[200px] my-4 gap-4 flex flex-col items-center justify-center border-gray-400 border-dashed rounded-md' htmlFor="file">
                                {isLoading
                                    ? <Loading />
                                    : <div className='flex flex-col items-center justify-center'>
                                        <BsCameraFill color='blue' size={50} />
                                        Thêm ảnh
                                    </div>}
                            </label>
                            <input onChange={handleFiles} hidden type="file" id='file' multiple />
                            <small className='text-red-500 block w-full'>
                                {invalidFields?.some(item => item.name === 'images') && invalidFields?.find(item => item.name === 'images')?.message}
                            </small>
                            <div className='w-full'>
                                <h3 className='font-medium py-4'>Ảnh đã chọn</h3>
                                <div className='flex gap-4 items-center'>
                                    {imagesPreview?.map(item => {
                                        return (
                                            <div key={item} className='relative w-1/3 h-1/3 '>
                                                <img src={item} alt="preview" className='w-full h-full object-cover rounded-md' />
                                                <span
                                                    title='Xóa'
                                                    onClick={() => handleDeleteImage(item)}
                                                    className='absolute top-0 right-0 p-2 cursor-pointer bg-gray-300 hover:bg-gray-400 rounded-full'
                                                >
                                                    <ImBin />
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='w-full mb-6'>
                        <h2 className='font-semibold text-xl py-4'>Video</h2>
                        <small>Cập nhật video rõ ràng sẽ cho thuê nhanh hơn</small>
                        <div className='w-full'>
                            <label className='w-full border-2 h-[200px] my-4 gap-4 flex flex-col items-center justify-center border-gray-400 border-dashed rounded-md' htmlFor="video">
                                {isVideoUploading
                                    ? <Loading />
                                    : <div className='flex flex-col items-center justify-center'>
                                        <FaVideo color='blue' size={50} />
                                        Thêm video
                                    </div>}
                            </label>
                            <input onChange={handleVideoUpload} hidden type="file" id='video' accept="video/*" />

                            <div className='w-full'>
                                <h3 className='font-medium py-4'>Video đã chọn</h3>
                                {videoPreview && (
                                    <div className='relative w-3/5 h-4/5 '>
                                        <video controls className='w-full h-full object-cover rounded-md'>
                                            <source src={videoPreview} type="video/mp4" />
                                        </video>
                                        <span
                                            title='Xóa'
                                            onClick={handleDeleteVideo}
                                            className='absolute top-0 right-0 p-2 cursor-pointer bg-gray-300 hover:bg-gray-400 rounded-full'
                                        >
                                            <ImBin />
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={handleSubmit}
                        text={isEdit ? 'Cập nhật' : 'Tạo mới'}
                        bgColor='bg-green-600'
                        textColor='text-white'
                    />
                    <div className='h-[500px]'>

                    </div>
                </div>
                <div className='w-[35%] flex-none pt-10 '>
                    {/* <Map address={payload.address} /> */}
                    <MapBox address={payload.address} />
                </div>
            </div>
        </div>
    )
}

export default CreatePost