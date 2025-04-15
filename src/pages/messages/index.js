import React, { useContext, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessageSR } from '../../stores/redux/actions/messageAction';
import { fetchUsersExceptId } from '../../stores/redux/actions/userActions';
import { AuthContext } from '../../contexts/start/AuthContext';
import io from 'socket.io-client';
import moment from 'moment';
import 'moment/locale/vi';
import axiosClient from '../../api/axiosClient';
import {
  Loader,
  Search,
  Video,
  Phone,
  MoreVertical,
  Paperclip,
  Smile,
  Mic,
  Send,
  Image as ImageIcon,
  CheckCheck,
  MessageSquare,
  Filter,
  User,
  Plus,
  Bell,
  Calendar,
  X
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { HeaderPages } from '../../components/header';

export const MessagesPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState(null);
  const [loadingImg, setLoadingImg] = useState(false);
  const [userStatus, setUserStatus] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const { user: currentUser, socket } = useContext(AuthContext);
  const { users } = useSelector((state) => state.users);

  const idSender = currentUser.id;

  // Set selected user from navigation
  useEffect(() => {
    if (location.state?.selectedUser) {
      setSelectedUser(location.state.selectedUser);
    }
  }, [location.state]);

  // Handle online status
  useEffect(() => {
    if (currentUser && socket) {
      socket.emit("user_online", currentUser.id);

      socket.on("update_user_status", (onlineUsers) => {
        const statusObj = {};
        users.forEach((user) => {
          statusObj[user._id] = onlineUsers.includes(user._id) ? "Đang hoạt động" : "Không hoạt động";
        });
        setUserStatus(statusObj);
      });

      return () => {
        socket.off("user_online");
        socket.off("update_user_status");
      };
    }
  }, [currentUser, socket, users]);

  // Fetch users
  useEffect(() => {
    dispatch(fetchUsersExceptId(currentUser.id));
  }, [dispatch, currentUser.id]);

  // Filter users based on search term
  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  // Fetch messages for selected user
  useEffect(() => {
    if (selectedUser) {
      axiosClient
        .get(`/message/get-message/list/${currentUser.id}/${selectedUser._id}`)
        .then((res) => setMessages(res.data))
        .catch((err) => console.error(err));

      // Focus on message input when user is selected
      if (messageInputRef.current) {
        messageInputRef.current.focus();
      }
    }
  }, [selectedUser, currentUser]);

  // Listen for new messages
  useEffect(() => {
    socket.on('new_message', (newMessage) => {
      if (
        (newMessage.idSender === idSender && newMessage.idReceiver === selectedUser?._id) ||
        (newMessage.idSender === selectedUser?._id && newMessage.idReceiver === idSender)
      ) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    return () => socket.off('new_message');
  }, [selectedUser, idSender]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle image upload
  const handleUploadImage = async (e) => {
    setLoadingImg(true);
    const file = e.target.files[0];
    if (!file) {
      setLoadingImg(false);
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axiosClient.post('/message/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setImage(res.data.imageUrl);
    } catch (error) {
      alert('Không thể tải ảnh lên, vui lòng thử lại');
    }
    setLoadingImg(false);
    e.target.value = '';
  };

  // Send message
  const sendMessage = () => {
    if ((message.trim() || image) && selectedUser) {
      const newMessage = {
        idSender,
        idReceiver: selectedUser._id,
        content: message,
        image,
        time: new Date().toISOString(),
      };
      socket.emit('new_message', newMessage);
      setMessage('');
      setImage(null);

      // Focus on input after sending
      if (messageInputRef.current) {
        messageInputRef.current.focus();
      }
    }
  };

  // Select user to chat with
  const selectUser = (user) => {
    setSelectedUser(user);
  };

  // Format dates for grouping messages
  const formatMessageDate = (dateString) => {
    const messageDate = moment(dateString);
    const today = moment().startOf('day');
    const yesterday = moment().subtract(1, 'days').startOf('day');

    if (messageDate.isSame(today, 'day')) {
      return 'Hôm nay';
    } else if (messageDate.isSame(yesterday, 'day')) {
      return 'Hôm qua';
    } else {
      return messageDate.format('DD/MM/YYYY');
    }
  };

  // Group messages by date
  const groupedMessages = () => {
    const groups = {};

    messages.forEach(msg => {
      const date = formatMessageDate(msg.time);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });

    return groups;
  };

  // Get first letters of name for avatar
  const getInitials = (name) => {
    if (!name) return '';
    const nameParts = name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <HeaderPages title="Tin nhắn" />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Contact List */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-2 pl-10 text-sm bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Tìm kiếm liên hệ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
              {searchTerm && (
                <button
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchTerm('')}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-gray-200 px-2">
            <button className="flex-1 py-3 px-2 text-sm font-medium text-indigo-600 border-b-2 border-indigo-600">
              Tất cả
            </button>
            <button className="flex-1 py-3 px-2 text-sm font-medium text-gray-500 hover:text-gray-700">
              Chưa đọc
            </button>
            <button className="flex-1 py-3 px-2 text-sm font-medium text-gray-500 hover:text-gray-700">
              Nhóm
            </button>
          </div>

          {/* Contacts */}
          <div className="overflow-y-auto flex-1">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className={`p-3 hover:bg-gray-50 cursor-pointer transition duration-150 flex items-center ${
                    selectedUser?._id === user._id ? 'bg-indigo-50 border-l-4 border-indigo-500' : 'border-l-4 border-transparent'
                  }`}
                  onClick={() => selectUser(user)}
                >
                  <div className="relative">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-medium text-lg border border-gray-200">
                        {getInitials(user.name)}
                      </div>
                    )}
                    {userStatus[user._id] === 'Đang hoạt động' && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{user.name}</h3>
                      <span className="text-xs text-gray-500">12:30</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 truncate mt-1 max-w-[160px]">
                        {user.email || ""}
                      </p>
                      {userStatus[user._id] === 'Đang hoạt động' ? (
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      ) : (
                        <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                <User className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <p>Không tìm thấy liên hệ nào</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-50">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 p-3 flex justify-between items-center shadow-sm">
                <div className="flex items-center">
                  <div className="relative">
                    {selectedUser.avatar ? (
                      <img
                        src={selectedUser.avatar}
                        alt={selectedUser.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-medium text-lg">
                        {getInitials(selectedUser.name)}
                      </div>
                    )}
                    {userStatus[selectedUser._id] === 'Đang hoạt động' && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-800">{selectedUser.name}</h3>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500">{userStatus[selectedUser._id] || 'Không hoạt động'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button className="p-2 rounded-full hover:bg-gray-100 transition">
                    <Video size={18} className="text-gray-600" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition">
                    <Phone size={18} className="text-gray-600" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition">
                    <MoreVertical size={18} className="text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 bg-slate-50" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/subtle-white-feathers.png")' }}>
                <div className="max-w-3xl mx-auto space-y-6">
                  {Object.entries(groupedMessages()).map(([date, msgs]) => (
                    <div key={date}>
                      <div className="flex justify-center mb-4">
                        <div className="bg-white text-xs text-gray-500 px-3 py-1 rounded-full shadow-sm">
                          {date}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {msgs.map((msg, msgIndex) => {
                          const isSender = msg.idSender === idSender;
                          const prevMsg = msgIndex > 0 ? msgs[msgIndex - 1] : null;
                          const showAvatar = !prevMsg || prevMsg.idSender !== msg.idSender;

                          return (
                            <div key={msgIndex} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                              {!isSender && showAvatar && (
                                <div className="w-8 h-8 rounded-full mr-2 self-end mb-1 flex-shrink-0">
                                  {selectedUser.avatar ? (
                                    <img
                                      src={selectedUser.avatar}
                                      alt={selectedUser.name}
                                      className="w-8 h-8 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-medium text-xs">
                                      {getInitials(selectedUser.name)}
                                    </div>
                                  )}
                                </div>
                              )}

                              {!isSender && !showAvatar && <div className="w-8 mr-2 flex-shrink-0"></div>}

                              <div
                                className={`max-w-xs md:max-w-md ${
                                  isSender
                                    ? 'bg-indigo-600 text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl'
                                    : 'bg-white text-gray-800 rounded-tl-xl rounded-tr-xl rounded-br-xl shadow-sm'
                                } px-4 py-2.5 text-sm`}
                              >
                                {msg.content && (
                                  <p className={`leading-relaxed ${isSender ? 'text-white' : 'text-gray-700'}`}>
                                    {msg.content}
                                  </p>
                                )}
                                {msg.image && (
                                  <img
                                    src={msg.image}
                                    alt="Shared"
                                    className="rounded-lg mt-2 max-w-full h-auto cursor-pointer hover:opacity-95 transition"
                                  />
                                )}
                                <div className={`text-xs mt-1 flex justify-end ${isSender ? 'text-indigo-200' : 'text-gray-400'}`}>
                                  {moment(msg.time).format('HH:mm')}
                                  {isSender && (
                                    <CheckCheck size={12} className="ml-1" />
                                  )}
                                </div>
                              </div>

                              {isSender && showAvatar && (
                                <div className="w-8 h-8 rounded-full ml-2 self-end mb-1 flex-shrink-0">
                                  {currentUser.avatar ? (
                                    <img
                                      src={currentUser.avatar}
                                      alt={currentUser.name}
                                      className="w-8 h-8 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-medium text-xs">
                                      {getInitials(currentUser.name)}
                                    </div>
                                  )}
                                </div>
                              )}

                              {isSender && !showAvatar && <div className="w-8 ml-2 flex-shrink-0"></div>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Image Preview */}
              {(loadingImg || image) && (
                <div className="bg-white p-2 border-t border-gray-200">
                  <div className="flex justify-start px-4">
                    {loadingImg ? (
                      <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
                        <Loader size={18} className="text-indigo-600 animate-spin" />
                        <span className="text-xs text-gray-600">Đang tải ảnh...</span>
                      </div>
                    ) : (
                      image && (
                        <div className="relative inline-block">
                          <img src={image} alt="Preview" className="h-24 rounded-lg border border-gray-200" />
                          <button
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                            onClick={() => setImage(null)}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 p-3">
                <div className="flex items-end max-w-4xl mx-auto rounded-xl p-1">
                  <div className="flex items-center gap-1 mr-1">
                    <button className="p-2 text-gray-500 hover:text-indigo-500 hover:bg-gray-100 rounded-full transition">
                      <Plus size={20} />
                    </button>
                    <label className="p-2 text-gray-500 hover:text-indigo-500 hover:bg-gray-100 rounded-full transition cursor-pointer">
                      <ImageIcon size={20} />
                      <input type="file" className="hidden" onChange={handleUploadImage} accept="image/*" />
                    </label>
                  </div>

                  <div className="flex-1 flex bg-gray-100 rounded-2xl px-3 py-2">
                    <input
                      type="text"
                      ref={messageInputRef}
                      placeholder="Nhập tin nhắn của bạn..."
                      className="flex-1 bg-transparent border-none text-sm focus:outline-none"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <div className="flex items-center gap-1 ml-2">
                      <button className="p-1.5 text-gray-500 hover:text-indigo-500 rounded-full transition">
                        <Smile size={20} />
                      </button>
                      <button className="p-1.5 text-gray-500 hover:text-indigo-500 rounded-full transition">
                        <Mic size={20} />
                      </button>
                    </div>
                  </div>

                  <button
                    className="ml-2 p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors flex-shrink-0"
                    onClick={sendMessage}
                    disabled={!message.trim() && !image}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
              <div className="text-center p-8 max-w-md">
                <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare size={32} className="text-indigo-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">Tin nhắn của bạn</h3>
                <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                  Chọn một liên hệ bên trái để bắt đầu trò chuyện hoặc tạo một cuộc trò chuyện mới bằng cách nhấn vào nút bên dưới.
                </p>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center">
                  <Plus size={16} className="mr-1.5" />
                  <span>Tạo cuộc trò chuyện mới</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};