import icons from './icons'

const { ImPencil2, MdOutlineLibraryBooks, GrSystem, MdManageAccounts } = icons

const memuSidebar = [
    {
        id: 1,
        text: 'Quản lý hệ thống',
        path: '/dashboard/quan-ly-he-thong',
        icon: <GrSystem />
    },
    {
        id: 2,
        text: 'Quản lý tin đăng',
        path: '/dashboard/tat-ca-bai-dang',
        icon: <MdOutlineLibraryBooks />
    },
    {
        id: 3,
        text: 'Quản lý người dùng',
        path: '/dashboard/quan-ly-nguoi-dung',
        icon: <MdManageAccounts />
    },




]

export default memuSidebar