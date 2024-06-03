import icons from './icons'

const { ImPencil2, MdOutlineLibraryBooks, GrSystem, FaRegCircleUser, RiHeartFill } = icons

const menuManage = [
    {
        id: 1,
        text: 'Đăng tin cho thuê',
        path: '/he-thong/tao-moi-bai-dang',
        icon: <ImPencil2 color='#febb02' />
    },
    {
        id: 2,
        text: 'Quản lý tin đăng',
        path: '/he-thong/quan-ly-bai-dang',
        icon: <MdOutlineLibraryBooks color='green' />
    },
    {
        id: 3,
        text: 'Thông tin cá nhân',
        path: '/he-thong/thong-tin-ca-nhan',
        icon: <FaRegCircleUser />
    },
    {
        id: 4,
        text: 'Bài đăng đã lưu',
        path: '/bai-dang-da-luu',
        icon: <RiHeartFill color='#E13427' />
    },



];
const isAdmin = true; // Đây là nơi kiểm tra xem người dùng có phải là admin hay không

if (isAdmin) {
    menuManage.push({
        id: 4,
        text: 'Quản lý hệ thống',
        path: '/dashboard/quan-ly-he-thong',
        icon: <GrSystem color='red' />
    });
}

export default menuManage