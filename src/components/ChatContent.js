import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../store/actions';
import { IoIosCloseCircle } from "react-icons/io";
import moment from 'moment-timezone';
import io from 'socket.io-client';

const socket = io.connect("http://3.107.49.162:5000");
const ChatContent = ({ chatUsers, onClose, conversationId }) => {
    const dispatch = useDispatch();
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const messagesEndRef = useRef(null);
    const { users, msg } = useSelector(state => state.user);
    const { currentData } = useSelector(state => state.user);
    const { messagesByRoom, error } = useSelector(state => state.message);
    const [recipientInfo, setRecipientInfo] = useState(null);

    useEffect(() => {
        if (conversationId) {
            // Tìm conversation trong userConversations dựa trên conversationId
            const conversation = chatUsers.find(conversation => conversation.id === conversationId);
            // Xác định ID của người nhận tin nhắn
            const recipientId = conversation.user1Id === currentData.id ? conversation.user2Id : conversation.user1Id;
            // Tìm thông tin của người nhận tin nhắn dựa trên ID
            const recipient = users.find(user => user.id === recipientId);
            // Cập nhật state với thông tin của người nhận tin nhắn
            setRecipientInfo(recipient);
        }
    }, [conversationId, chatUsers, currentData.id, users]);

    useEffect(() => {
        dispatch(actions.getAllUser());
    }, [dispatch]);

    useEffect(() => {
        dispatch(actions.fetchMessagesByRoom(conversationId));
    }, [dispatch, conversationId]);

    useEffect(() => {
        // Gửi sự kiện mark_as_read khi người dùng vào phòng chat
        socket.emit('mark_as_read', { conversationId: conversationId });
    }, [socket, conversationId]);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                conversationId: conversationId,
                userId: currentData.id,
                message: currentMessage,
                time: moment().tz("Asia/Ho_Chi_Minh").format(),

            };

            try {
                // Gửi tin nhắn mới qua Socket.io
                socket.emit('send_message', messageData);

                // Reset nội dung tin nhắn hiện tại
                setCurrentMessage("");
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    };

    useEffect(() => {
        const handleMessageReceive = (newMessage) => {
            // Kiểm tra xem tin nhắn mới có tồn tại trong danh sách tin nhắn local không
            setMessageList((list) => {
                const messageExists = list.some(message => message.id === newMessage.id);
                // Nếu không tồn tại, thêm tin nhắn mới vào danh sách tin nhắn local
                if (!messageExists) {
                    return [...list, newMessage];
                }
                return list;
            });
        };

        socket.on('receive_message', handleMessageReceive);

        return () => {
            socket.off('receive_message', handleMessageReceive);
        };
    }, []);

    useEffect(() => {
        setMessageList(messagesByRoom);
    }, [messagesByRoom]);

    useEffect(() => {
        socket.emit('join_room', conversationId);
    }, [conversationId]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messageList]);

    return (
        <div className='flex flex-col h-full'>
            <div className='flex-1 p-2 ml-4 justify-between flex flex-col'>
                <div className='flex sm:items-center justify-between py-1 border-b-2 border-gray-200'>
                    <div className='relative flex gap-3 items-center'>
                        <div className='relative'>
                            {recipientInfo && (
                                <img src={recipientInfo?.avatar || "https://hethongxephangtudong.net/public/client/images/no-avatar.png"} className='w-10 h-10 object-cover rounded-full' alt={recipientInfo?.name} />
                            )}
                        </div>
                        <div className='flex flex-col leading-tight'>
                            <div className='text-lg mt-1 flex items-center'>
                                <span className='text-gray-700 mr-3 font-bold'>{recipientInfo && recipientInfo?.name}</span>
                            </div>
                        </div>
                    </div>
                    <IoIosCloseCircle size={26} color="#E03C31" onClick={onClose} />
                </div>
                <div id='messages' ref={messagesEndRef} className='h-[420px] bg-[#f3f3f3] flex-col space-y-2 p-3 overflow-y-auto'>
                    {messageList.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            Bắt đầu cuộc trò chuyện!
                        </div>
                    ) : (
                        messageList.map((messageContent, index) => (
                            <div className={`chat-message ${currentData.id === messageContent.userId ? " flex justify-end" : ""}`} key={index}>
                                <div className={`flex items-end ${currentData.id === messageContent.userId ? "order-1" : "order-2"}`}>
                                    <div className={`flex flex-col space-y-2 text-sm max-w-xs mx-2 ${currentData.id === messageContent.userId ? "items-end order-1" : "items-start order-2"}`}>
                                        <div>
                                            <span className={`px-4 py-2 rounded-lg inline-block ${currentData.id === messageContent.userId ? "bg-[rgb(210,248,238)]" : "bg-white"} text-gray-700 ${currentData.id === messageContent.userId ? "rounded-br-none" : "rounded-bl-none"}`}>
                                                {messageContent.message}
                                                <br />
                                                <span className="text-xs flex mt-1 text-gray-500 justify-end">{moment(messageContent.time).tz("Asia/Ho_Chi_Minh").format('HH:mm')}</span> {/* Hiển thị thời gian theo múi giờ Việt Nam */}
                                            </span>
                                        </div>
                                    </div>
                                    <img
                                        src={
                                            currentData.id === messageContent.userId
                                                ? currentData.avatar || "https://hethongxephangtudong.net/public/client/images/no-avatar.png"
                                                : recipientInfo?.avatar || "https://hethongxephangtudong.net/public/client/images/no-avatar.png"
                                        }
                                        alt='Profile'
                                        className={`w-7 h-7 object-cover rounded-full ${currentData.id === messageContent.userId ? "order-2" : "order-1"}`}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className='border-t-2 border-gray-200 px-4 pt-2 mb-2 sm:mb-0'>
                    <div className='relative flex'>
                        <input
                            type='text'
                            value={currentMessage}
                            placeholder='Viết tin nhắn!'
                            className='w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-4 bg-gray-200 rounded-md py-2'
                            onChange={(event) => setCurrentMessage(event.target.value)}
                            onKeyPress={(event) => {
                                if (event.key === "Enter") {
                                    sendMessage();
                                    event.preventDefault();  // Ngăn chặn hành vi mặc định của phím Enter
                                }
                            }}
                        />
                        <div className='absolute right-0 items-center inset-y-0 hidden sm:flex'>
                            <button
                                type='button'
                                className='inline-flex items-center justify-center rounded-full h-8 w-8 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none'
                                onClick={sendMessage}
                            >
                                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' className='h-6 w-6 text-gray-600'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13'></path>
                                </svg>
                            </button>
                            <button type="button" class="inline-flex items-center justify-center rounded-full h-8 w-8 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6 text-gray-600">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                            </button>
                            <button type="button" class="inline-flex items-center justify-center rounded-full h-8 w-8 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6 text-gray-600">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatContent;