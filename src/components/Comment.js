import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createCommentRequest } from '../store/actions/comment';
import { createNewCommentService, getCommentsByPostIdService } from '../services/comment';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import trang from '../assets/trang.jpg'
import { CiMenuKebab } from "react-icons/ci";
import { FaStar } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { deleteCommentService, hiddenCommentService } from '../services/comment';
import { updatePostStarsService } from '../services/post';
const Comment = () => {
    const dispatch = useDispatch();
    const { postId } = useParams();
    const { currentData } = useSelector(state => state.user);
    const navigate = useNavigate();

    const [commentContent, setCommentContent] = useState('');
    const [comments, setComments] = useState([]);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [commentSuccess, setCommentSuccess] = useState(false);
    const [rating, setRating] = useState(0);
    const [selectedComment, setSelectedComment] = useState(null); // Lưu trữ bình luận được chọn
    const [showMenu, setShowMenu] = useState(null); // Hiển thị menu hoặc không
    const [lastClickedCommentId, setLastClickedCommentId] = useState(null);



    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            const commentsData = await getCommentsByPostIdService(postId);
            // Lọc ra những bình luận chưa bị ẩn
            const visibleComments = commentsData.filter(comment => !comment.hidden);
            setComments(visibleComments);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const userId = currentData ? currentData.id : null;
        const content = event.target.body ? event.target.body.value : ''; // Ensure event.target.body is defined

        try {
            if (!userId) {
                navigate('/login');
                return;
            }

            dispatch(createCommentRequest(userId, postId, content, rating));
            await createNewCommentService(userId, postId, content, rating);

            // Sau khi đăng bình luận thành công, gọi API updatePostStars để tính toán lại số sao
            await updatePostStarsService(); // Gọi hàm updatePostStars

            setCommentContent('');
            fetchComments();
            setIsPopupVisible(false);
            setCommentSuccess(true);
        } catch (error) {
            console.error('Failed to create comment:', error);
        }
    };

    const handleRatingClick = (selectedRating) => {
        setRating(selectedRating); // Cập nhật số sao đánh giá khi người dùng nhấp vào biểu tượng sao
        setIsPopupVisible(true);
    };


    const handleClosePopup = () => {
        setIsPopupVisible(false);
    };
    const handleStar = (star) => {
        return Array.from({ length: +star }, (_, index) => index + 1);
    };

    const handleContextMenu = (comment) => {
        setSelectedComment(comment); // Lưu trữ thông tin bình luận được chọn

        if (showMenu === comment.id) {
            setShowMenu(null); // Ẩn menu nếu click lần thứ hai vào cùng một bình luận
        } else {
            setShowMenu(comment.id); // Hiển thị menu cho bình luận được chọn
        }

        setLastClickedCommentId(comment.id); // Lưu id của bình luận được click lần cuối
    };

    // Hàm xử lý sửa bình luận
    const handleHiddenComment = async () => {
        try {
            // Thực hiện xóa bình luận bằng cách gọi deleteCommentService với selectedComment.id
            await hiddenCommentService(selectedComment.id);
            await updatePostStarsService(); // Gọi hàm updatePostStars 

            // Xóa bình luận thành công, cập nhật danh sách bình luận
            await fetchComments(); // Gọi lại hàm fetchComments để cập nhật danh sách bình luận mới
        } catch (error) {


            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Bạn có không có quyền ẩn bình luận này!',
            });
        } finally {
            setShowMenu(null); // Ẩn menu lựa chọn sau khi thực hiện hành động
        }
    };

    // Hàm xử lý xóa bình luận
    const handleDeleteComment = async () => {
        try {
            // Thực hiện xóa bình luận bằng cách gọi deleteCommentService với selectedComment.id
            await deleteCommentService(selectedComment.id);

            // Xóa bình luận thành công, cập nhật danh sách bình luận
            // Sau khi đăng bình luận thành công, gọi API updatePostStars để tính toán lại số sao
            await updatePostStarsService(); // Gọi hàm updatePostStars
            await fetchComments(); // Gọi lại hàm fetchComments để cập nhật danh sách bình luận mới
        } catch (error) {


            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Bạn có không có quyền xóa bình luận này!',
            });
        } finally {
            setShowMenu(null); // Ẩn menu lựa chọn sau khi thực hiện hành động
        }
    };

    return (
        <div className="w-full bg-white p-2 my-4">
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                    {comments.map((comment, index) => (
                        <div key={index} className="flex items-start w-full border rounded-md">
                            <div className="p-3 flex gap-6 flex-1">
                                <img src={comment.user.avatar || 'https://hethongxephangtudong.net/public/client/images/no-avatar.png'} alt="avatar" className="object-cover w-10 h-10 rounded-full border-2 border-emerald-400 shadow-emerald-400" />
                                <div className="flex flex-col justify-between">
                                    <h3>
                                        <p className="font-bold">{comment.user.name}</p>
                                        <p className='text-[12px]'>{format(new Date(comment.createdAt), 'dd/MM/yyyy')}</p>
                                    </h3>
                                    <p className='flex gap-1 mt-3 mb-2'>
                                        {handleStar(comment.rate).map((star, number) => (
                                            <FaStar key={number} className="star-item" style={{ color: '#fbbf24' }} size={23} />
                                        ))}
                                    </p>
                                    <p className="text-gray-600 mt-2">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                            <div className="relative p-3">
                                <CiMenuKebab size={24} color='black' onClick={() => handleContextMenu(comment)} />
                                {showMenu === comment.id && (
                                    <div className="absolute right-1 mt-2">
                                        <div className="w-32 bg-white border border-gray-200 rounded-md shadow-lg divide-y divide-gray-100">
                                            <button className="block rounded-md w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleHiddenComment}>
                                                Ẩn bình luận
                                            </button>
                                            <button className="block rounded-md w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleDeleteComment}>
                                                Xóa bình luận
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {isPopupVisible && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white min-w-1xl flex flex-col rounded-xl shadow-lg">
                            <div className="px-12 py-5">
                                <h2 className="text-gray-800 text-3xl font-semibold">Đánh giá bài đăng này!</h2>
                            </div>
                            <div className="bg-gray-200 w-full flex flex-col items-center">
                                <div className="flex flex-col items-center py-6 space-y-3">
                                    <span className="text-lg text-gray-800">Chất lượng chỗ ở thế nào!</span>
                                    <div className="flex space-x-3">
                                        {/* Bạn có thể thay đổi onClick cho mỗi biểu tượng sao để gọi handleRatingClick với số sao tương ứng */}
                                        <FaStar className="cursor-pointer" size={28} color={rating >= 1 ? '#fbbf24' : 'gray'} onClick={() => handleRatingClick(1)} />
                                        <FaStar className="cursor-pointer" size={28} color={rating >= 2 ? '#fbbf24' : 'gray'} onClick={() => handleRatingClick(2)} />
                                        <FaStar className="cursor-pointer" size={28} color={rating >= 3 ? '#fbbf24' : 'gray'} onClick={() => handleRatingClick(3)} />
                                        <FaStar className="cursor-pointer" size={28} color={rating >= 4 ? '#fbbf24' : 'gray'} onClick={() => handleRatingClick(4)} />
                                        <FaStar className="cursor-pointer" size={28} color={rating >= 5 ? '#fbbf24' : 'gray'} onClick={() => handleRatingClick(5)} />
                                    </div>
                                </div>
                                <div className="w-3/4 flex flex-col">
                                    <textarea
                                        className="p-4 text-gray-500 h-[120px] rounded-xl resize-none font-medium placeholder-gray-700 focus:outline-none focus:bg-white"
                                        name="body"
                                        placeholder="Nhập bình luận"
                                        required
                                        value={commentContent}
                                        onChange={(e) => setCommentContent(e.target.value)}
                                    ></textarea>

                                    <input
                                        type="submit"
                                        className="py-3 my-8  bg-[#0E2E50] rounded-xl text-white"
                                        value="Đăng đánh giá"
                                    />

                                </div>
                            </div>
                            <div className="h-14 flex items-center justify-center">
                                <div className="text-gray-600" onClick={handleClosePopup}>Đóng</div>
                            </div>
                        </div>
                    </div>
                )}
                <button
                    type="button"
                    className="px-2.5 py-1.5 ml-[685px] rounded-md cursor-pointer text-white bg-[#0E2E50] mt-6"
                    onClick={handleRatingClick}
                >
                    Viết đánh giá
                </button>

            </form>

        </div>
    );
};

export default Comment;
