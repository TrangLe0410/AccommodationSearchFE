import icons from './icons'

const { ImPencil2, MdOutlineLibraryBooks, BiUserPin, FaCalendarAlt, FaRegCircleUser } = icons

const memuSidebar = [
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
        text: 'Quản lý lịch hẹn',
        icon: <FaCalendarAlt color='#6a329f' />,
        subItems: [
            {
                id: 3.1,
                text: 'Lịch Hẹn Cá Nhân',
                path: '/he-thong/quan-ly-lich-hen/lich-hen-ca-nhan',

            },
            {
                id: 3.2,
                text: 'Lịch Hẹn Được Đặt',
                path: '/he-thong/quan-ly-lich-hen/lich-hen-duoc-dat',

            }
        ]
    },

    {
        id: 4,
        text: 'Thông tin cá nhân',
        path: '/he-thong/thong-tin-ca-nhan',
        icon: <FaRegCircleUser color='4c6ca8' />
    },
    {
        id: 5,
        text: 'Liên hệ',
        path: '/he-thong/lien-he',
        icon: <BiUserPin color='#fd0e35' />
    },

]

export default memuSidebar