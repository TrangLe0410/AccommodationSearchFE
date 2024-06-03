import React, { useState, useEffect } from 'react';
import { ChatContent, ChatSiderBar } from '../../components';
import * as actions from '../../store/actions';
import { useDispatch, useSelector } from 'react-redux';
const Chat = ({ socket, username, room, onClose }) => {
    const dispatch = useDispatch();
    const userConversations = useSelector(state => state.chat.conversationByUser); // Lấy danh sách room chat từ Redux state

    useEffect(() => {
        dispatch(actions.fetchUserConversationByUser()); // Gọi action để lấy danh sách room chat từ API và lưu vào Redux state
    }, [dispatch]);
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const handleRoomClick = (conversationId) => {
        // Nhận conversationId từ ChatSiderBar và cập nhật state
        setSelectedConversationId(conversationId);
    };





    return (
        <div className='w-full flex flex-col items-center'>
            <div className='w-full h-full overflow-hidden flex flex-col'>
                <div className='flex flex-1 w-full border border-gray-300 rounded-md bg-white'>
                    <div className='w-1/3 h-full overflow-hidden'>
                        <ChatSiderBar onRoomClick={handleRoomClick} chatUsers={userConversations} />
                    </div>
                    <div className='w-2/3 h-full border-l border-gray-300 overflow-hidden'>
                        <ChatContent onClose={onClose} chatUsers={userConversations} socket={socket} username={username} room={room} conversationId={selectedConversationId} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
