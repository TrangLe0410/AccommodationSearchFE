import React, { useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../store/actions';
import io from 'socket.io-client';
import { getMessageLastedByRoom, getUnreadMessagesCount } from '../services/messages';
import moment from 'moment-timezone';
const socket = io.connect("http://localhost:5000");
const ChatSiderBar = ({ onRoomClick, selectedConversationId }) => {
    const dispatch = useDispatch();
    const [selectedRoom, setSelectedRoom] = useState(null);
    const { users } = useSelector(state => state.user);
    const userConversations = useSelector(state => state.chat.conversationByUser);
    const { currentData } = useSelector(state => state.user);
    const [lastMessages, setLastMessages] = useState({});
    const [unreadMessagesCountMap, setUnreadMessagesCountMap] = useState({});

    useEffect(() => {
        dispatch(actions.getAllUser());
    }, [dispatch]);


    const handleRoomClick = async (roomId) => {
        setSelectedRoom(roomId);
        socket.emit("join_room", roomId);
        onRoomClick(roomId);

        // Đánh dấu tất cả các tin nhắn trong phòng đã được đọc
        markMessagesAsRead(roomId);
    };
    const markMessagesAsRead = async (roomId) => {
        try {
            await socket.emit("mark_as_read", { conversationId: roomId });
            // Cập nhật số tin nhắn chưa đọc của phòng thành 0
            setUnreadMessagesCountMap(prevMap => ({
                ...prevMap,
                [roomId]: 0
            }));
        } catch (error) {
            console.error("Error marking messages as read:", error);
        }
    };

    useEffect(() => {
        // Socket.io listener cho tin nhắn mới
        socket.on('new_message', async (data) => {
            // Lấy số tin nhắn chưa đọc cho phòng này
            const response = await getUnreadMessagesCount(data.conversationId);
            // Cập nhật số tin nhắn chưa đọc của phòng vào object lưu trữ
            setUnreadMessagesCountMap(prevMap => ({
                ...prevMap,
                [data.conversationId]: response.unreadMessagesCount
            }));
        });

        return () => {
            socket.off('new_message');
        };
    }, []);




    useEffect(() => {
        userConversations.forEach(async (chatRoom) => {
            try {
                const response = await getUnreadMessagesCount(chatRoom.id);
                setUnreadMessagesCountMap(prevMap => ({
                    ...prevMap,
                    [chatRoom.id]: response.unreadMessagesCount
                }));
            } catch (error) {
                console.error("Error fetching unread messages count:", error);
            }
        });
    }, [userConversations]);
    useEffect(() => {
        const handleLastMessageUpdate = (data) => {
            setLastMessages(prevMessages => ({
                ...prevMessages,
                [data.conversationId]: data.message
            }));
        };

        socket.on('last_message_update', handleLastMessageUpdate);

        return () => {
            socket.off('last_message_update', handleLastMessageUpdate);
        };
    }, []);

    useEffect(() => {
        userConversations.forEach(async (chatRoom) => {
            try {
                const latestMessage = await getMessageLastedByRoom(chatRoom.id);
                setLastMessages(prevMessages => ({
                    ...prevMessages,
                    [chatRoom.id]: latestMessage
                }));
            } catch (error) {
                console.error("Error fetching latest message:", error);
            }
        });
    }, [userConversations]);
    useEffect(() => {
        // Socket.io listener for unread count update
        const handleUnreadCountUpdate = (data) => {
            setUnreadMessagesCountMap(prevMap => ({
                ...prevMap,
                [data.conversationId]: data.unreadCount
            }));
        };

        socket.on('update_unread_count', handleUnreadCountUpdate);

        return () => {
            socket.off('update_unread_count', handleUnreadCountUpdate);
        };
    }, []);
    userConversations.sort((roomA, roomB) => {
        const lastMessageA = lastMessages[roomA.id];
        const lastMessageB = lastMessages[roomB.id];
        if (!lastMessageA && !lastMessageB) return 0;
        if (!lastMessageA) return 1;
        if (!lastMessageB) return -1;
        return moment(lastMessageB.time).valueOf() - moment(lastMessageA.time).valueOf();
    });


    useEffect(() => {
        const fetchLastMessages = async () => {
            try {
                const messagesPromises = userConversations.map(chatRoom => getMessageLastedByRoom(chatRoom.id));
                const lastMessagesData = await Promise.all(messagesPromises);
                const lastMessagesObj = {};
                lastMessagesData.forEach((message, index) => {
                    lastMessagesObj[userConversations[index].id] = message;
                });
                setLastMessages(lastMessagesObj);
            } catch (error) {
                console.error("Error fetching last messages:", error);
            }
        };

        fetchLastMessages();
    }, [userConversations]);

    return (
        <div className="h-screen">
            <div className="max-w-md mx-auto rounded-lg overflow-hidden md:max-w-lg">
                <div className="md:flex">
                    <div className="w-full p-3">
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full py-1  mb-3 border border-gray-300 rounded focus:outline-none px-3 focus:shadow-md"
                                placeholder="Search..."
                            />
                            <FaSearch className="absolute top-2 right-3 text-gray-300" />
                        </div>
                        <ul className='text-sm'>
                            {userConversations.map(chatRoom => {
                                const lastMessage = lastMessages[chatRoom.id] || {};
                                const otherUserId = currentData.id === chatRoom.user1Id ? chatRoom.user2Id : chatRoom.user1Id;
                                const otherUser = users.find(user => user.id === otherUserId);


                                return (
                                    <li key={chatRoom.id}
                                        className={`flex justify-between items-center bg-white mt-2 p-2 hover:bg-gray-200 rounded cursor-pointer transition ${selectedRoom === chatRoom.id ? 'bg-gray-300' : ''}`}
                                        onClick={() => handleRoomClick(chatRoom.id, otherUser)}
                                    >
                                        <div className="flex">
                                            <img src={otherUser?.avatar || 'https://hethongxephangtudong.net/public/client/images/no-avatar.png'} className='w-10 h-10 object-cover rounded-full border-2 border-emerald-400 shadow-emerald-400' alt={otherUser?.name} />
                                            <div className="flex flex-col ml-2">
                                                <span className="font-medium text-black">{otherUser?.name}</span>
                                                <span className="text-black">{lastMessage.message}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center text-sm">
                                            <span className="text-gray-300">
                                                {lastMessages[chatRoom.id] && moment(lastMessages[chatRoom.id].time).tz("Asia/Ho_Chi_Minh").format('DD/MM')}
                                            </span>
                                            {unreadMessagesCountMap[chatRoom.id] > 0 && (
                                                <p className='bg-red-600 flex justify-center items-center text-white w-4 h-4 rounded-full'>
                                                    {unreadMessagesCountMap[chatRoom.id]}
                                                </p>
                                            )}

                                        </div>

                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatSiderBar;