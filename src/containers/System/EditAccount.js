import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { apiUpdateProfile, apiUploadImages } from '../../services';
import Swal from 'sweetalert2';

const EditAccount = () => {
    const { currentData } = useSelector(state => state.user);
    const [avatarUrl, setAvatarUrl] = useState(currentData.avatar || ''); // State để lưu URL của ảnh đại diện
    const [formData, setFormData] = useState({
        phone: currentData.phone,
        zalo: currentData.zalo,
        name: currentData.name,
        address: currentData.address,
    });

    const handleImageUpload = (event) => {
        const selectedImage = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const imagePreviewUrl = e.target.result;
            setAvatarUrl(imagePreviewUrl); // Cập nhật state với URL của ảnh mới
        };
        reader.readAsDataURL(selectedImage);
    };

    const uploadImagesToCloudinary = async () => {
        try {
            const formData = new FormData();
            // Append ảnh đại diện vào FormData
            formData.append('file', avatarUrl);
            formData.append('upload_preset', process.env.REACT_APP_UPLOAD_ASSETS_NAME);

            // Gọi API upload ảnh lên Cloudinary
            const response = await apiUploadImages(formData);
            // Trả về link ảnh đã được lưu trên Cloudinary
            return [response.data.secure_url];
        } catch (error) {
            console.error('Failed to upload images to Cloudinary:', error);
            return [];
        }
    };

    // Hàm xử lý thay đổi giá trị của trường form
    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value }); // Cập nhật dữ liệu form
    };

    console.log(formData)

    // Hàm gửi yêu cầu cập nhật thông tin cá nhân
    const handleUpdateProfile = async () => {
        try {
            // Lưu ảnh lên Cloudinary và nhận về link ảnh
            const uploadedImages = await uploadImagesToCloudinary();

            // Cập nhật formData với các thông tin cần thiết, bao gồm cả link ảnh
            const updatedFormData = {
                ...formData,
                avatar: uploadedImages[0] || '' // Giả sử bạn chỉ lưu một ảnh đại diện
            };

            // Gọi API cập nhật thông tin cá nhân với formData đã được cập nhật
            const response = await apiUpdateProfile(updatedFormData);
            console.log('Cập nhật thông tin thành công:', response.data);
            // Hiển thị thông báo thành công
            Swal.fire('Thành công', 'Cập nhật thông tin thành công', 'success');
        } catch (error) {
            console.error('Failed to update profile:', error);
            // Hiển thị thông báo lỗi
            Swal.fire('Lỗi', 'Cập nhật thông tin thất bạn', 'error');
        }
    };

    return (
        <div className='w-full flex justify-center items-center'>
            <div className="max-w-[700px] mx-4 bg-white shadow-xl rounded-lg text-gray-900">
                {/* Ảnh bìa */}
                <div className="rounded-t-lg h-32 overflow-hidden">
                    <img className="object-cover object-top w-full" src='https://images.unsplash.com/photo-1449844908441-8829872d2607?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw2fHxob21lfGVufDB8MHx8fDE3MTA0MDE1NDZ8MA&ixlib=rb-4.0.3&q=80&w=1080' alt='Mountain' />
                </div>

                {/* Ảnh đại diện */}
                <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
                    <input
                        type="file"
                        id="imageUpload"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                    />
                    <label htmlFor="imageUpload" className="cursor-pointer">
                        <img className="object-cover object-center h-32" src={avatarUrl || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw4fHxwcm9maWxlfGVufDB8MHx8fDE3MTEwMDM0MjN8MA&ixlib=rb-4.0.3&q=80&w=1080'} alt='Ảnh đại diện' />
                    </label>
                </div>
                <div className="text-center mt-2">
                    <h2 className="font-semibold">{currentData.name}</h2>
                </div>

                {/* Form chỉnh sửa */}
                <div className="flex gap-2 p-4 items-center justify-between w-full">
                    <div className="w-1/2 flex flex-row">
                        <label htmlFor="" className="dark:text-gray-800">Số điện thoại</label>
                        <input
                            type="text"
                            className="mt-2 py-2 p-4 w-full border rounded-md dark:border-gray-400 dark:bg-gray-100"
                            placeholder="Số điện thoại"
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)} // Sử dụng hàm handleChange để cập nhật giá trị của trường phone
                        />
                    </div>
                    <div className="w-1/2 flex flex-row ">
                        <label htmlFor="" className="dark:text-gray-800">Zalo</label>
                        <input
                            type="text"
                            className="mt-2 p-4 py-2 w-full border rounded-md dark:border-gray-400 dark:bg-gray-100"
                            placeholder="Zalo"
                            value={formData.zalo}
                            onChange={(e) => handleChange('zalo', e.target.value)} // Sử dụng hàm handleChange để cập nhật giá trị của trường zalo
                        />
                    </div>
                </div>
                <div className="flex gap-2 p-4 items-center justify-between w-full">
                    <div className="w-1/2 flex flex-row">
                        <label htmlFor="" className="dark:text-gray-800">Tên người dùng</label>
                        <input
                            type="text"
                            className="mt-2 py-2 p-4 w-full border rounded-md dark:border-gray-400 dark:bg-gray-100"
                            placeholder="Tên người dùng"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)} // Sử dụng hàm handleChange để cập nhật giá trị của trường name
                        />
                    </div>
                    <div className="w-1/2 flex flex-row">
                        <label htmlFor="" className="dark:text-gray-800">Địa chỉ</label>
                        <input
                            type="text"
                            className="mt-2 p-4 py-2 w-full border rounded-md dark:border-gray-400 dark:bg-gray-100"
                            placeholder="Địa chỉ"
                            value={formData.address}
                            onChange={(e) => handleChange('address', e.target.value)} // Sử dụng hàm handleChange để cập nhật giá trị của trường address
                        />
                    </div>
                </div>


                <div className="p-4 border-t mx-8 mt-2">
                    <button className="w-1/2 block mx-auto rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2"
                        onClick={handleUpdateProfile}>Chỉnh sửa</button>
                </div>
            </div>
        </div>
    )
}

export default EditAccount;
