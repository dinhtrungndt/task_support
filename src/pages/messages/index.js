import React, { useContext, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessageSR } from '../../stores/redux/actions/messageAction';
import { fetchUsersExceptId } from '../../stores/redux/actions/userActions';
import { AuthContext } from '../../contexts/start/AuthContext';
import io from 'socket.io-client';
import moment from 'moment';
import 'moment/locale/vi';
import axiosClient from '../../api/axiosClient';
import { LoaderIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const socket = io(process.env.REACT_APP_API_URL, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export const MessagesPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState(null);
  const [loadingImg, setLoadingImg] = useState(false);
  const [userStatus, setUserStatus] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const messagesEndRef = useRef(null);

  const { messageses } = useSelector((state) => state.messages);
  const { users } = useSelector((state) => state.users);
  const auth = useContext(AuthContext);

  const idSender = auth.user.id;

  // Nhận selectedUser từ location.state
  useEffect(() => {
    if (location.state?.selectedUser) {
      setSelectedUser(location.state.selectedUser);
    }
  }, [location.state]);

  useEffect(() => {
    if (idSender) {
      socket.emit('user_online', idSender);
    }

    return () => {
      socket.off('user_online');
    };
  }, [idSender]);

  useEffect(() => {
    socket.on('update_user_status', (onlineUsers) => {
      const statusObj = {};
      users.forEach((user) => {
        statusObj[user._id] = onlineUsers.includes(user._id) ? 'Đang hoạt động' : 'Không hoạt động';
      });
      setUserStatus(statusObj);
    });

    return () => {
      socket.off('update_user_status');
    };
  }, [users]);

  useEffect(() => {
    dispatch(fetchUsersExceptId(auth.user.id));
  }, [dispatch, auth.user.id]);

  useEffect(() => {
    if (selectedUser) {
      axiosClient
        .get(`/message/get-message/list/${idSender}/${selectedUser._id}`)
        .then((res) => setMessages(res.data))
        .catch((err) => console.error(err));
    }
  }, [selectedUser, idSender]);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      console.error('Lỗi tải ảnh:', error);
      alert('Không thể tải ảnh lên, vui lòng thử lại');
    }
    setLoadingImg(false);
    e.target.value = '';
  };

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
    }
  };

  const selectUser = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 bg-white shadow-lg">
        <div className="p-4 bg-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center text-xl font-bold">
                {auth.user.name.charAt(0)}
              </div>
              <div>
                <h2 className="font-semibold">{auth.user.name}</h2>
                <div className="flex items-center text-xs">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                  Đang hoạt động
                </div>
              </div>
            </div>
            <button className="text-white hover:text-indigo-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              className="w-full px-4 py-2 pl-10 text-sm bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Tìm kiếm liên hệ..."
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
        <div className="overflow-y-auto" style={{ height: 'calc(100vh - 156px)' }}>
          {users.map((user) => (
            <div
              key={user._id}
              className={`p-3 border-b border-gray-100 hover:bg-indigo-50 cursor-pointer transition duration-150 flex items-start ${
                selectedUser?._id === user._id ? 'bg-indigo-50' : ''
              }`}
              onClick={() => selectUser(user)}
            >
              <div className="relative">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${user.name}`}
                  alt={user.name}
                  className="w-12 h-12 rounded-full mr-3 border-2 border-indigo-100"
                />
                {userStatus[user._id] === 'Đang hoạt động' && (
                  <div className="absolute bottom-0 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{user.name}</h3>
                  <span className="text-xs text-gray-500">{userStatus[user._id]}</span>
                </div>
                <p className="text-xs text-gray-500 truncate mt-1">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm">
              <div className="flex items-center">
                <div className="relative">
                  <img
                    src={selectedUser.avatar || `https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${selectedUser.name}`}
                    alt={selectedUser.name}
                    className="w-12 h-12 rounded-full mr-3 border-2 border-indigo-100"
                  />
                  {userStatus[selectedUser._id] === 'Đang hoạt động' && (
                    <div className="absolute bottom-0 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">{selectedUser.name}</h3>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500">{userStatus[selectedUser._id] || 'Không hoạt động'}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    ></path>
                  </svg>
                </button>
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    ></path>
                  </svg>
                </button>
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            <div
              className="flex-1 overflow-y-auto p-4 bg-gray-50"
              style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}
            >
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex justify-center">
                  <div className="bg-white text-xs text-gray-500 px-3 py-1 rounded-full shadow-sm">
                    Today, {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                  </div>
                </div>
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.idSender === idSender ? 'justify-end' : 'justify-start'}`}>
                    {msg.idSender !== idSender && (
                      <img
                        src={
                          selectedUser.avatar ||
                          `https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${selectedUser.name}`
                        }
                        alt="Contact"
                        className="w-8 h-8 rounded-full mr-2 self-end mb-1"
                      />
                    )}
                    <div
                      className={`max-w-xs md:max-w-md lg:max-w-lg ${
                        msg.idSender === idSender
                          ? 'bg-indigo-600 text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl'
                          : 'bg-white text-gray-800 rounded-tl-xl rounded-tr-xl rounded-br-xl shadow-md'
                      } px-4 py-3 text-sm`}
                    >
                      {msg.content && (
                        <p className={`leading-relaxed ${msg.idSender === idSender ? 'text-indigo-50' : 'text-gray-700'}`}>
                          {msg.content}
                        </p>
                      )}
                      {msg.image && <img src={msg.image} alt="Shared" className="rounded-lg mt-2 max-w-full" />}
                      <div className={`text-xs mt-1 flex justify-end ${msg.idSender === idSender ? 'text-indigo-200' : 'text-gray-400'}`}>
                        {moment(msg.time).fromNow()}
                        {msg.idSender === idSender && (
                          <svg className="w-4 h-4 ml-1 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        )}
                      </div>
                    </div>
                    {msg.idSender === idSender && (
                      <img
                        src={`https://ui-avatars.com/api/?background=4f46e5&color=ffffff&bold=true&name=${auth.user.name}`}
                        alt="You"
                        className="w-8 h-8 rounded-full ml-2 self-end mb-1"
                      />
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
            {(loadingImg || image) && (
              <div className="bg-white p-2 border-t border-gray-200">
                <div className="flex justify-center">
                  {loadingImg ? (
                    <LoaderIcon style={{ fontSize: 24 }} spin="true" />
                  ) : (
                    image && (
                      <div className="relative inline-block">
                        <img src={image} alt="Preview" className="h-20 rounded-lg" />
                        <button
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                          onClick={() => setImage(null)}
                        >
                          ✖
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center max-w-4xl mx-auto bg-gray-100 rounded-xl shadow-sm p-1">
                <label className="p-2 ml-1 text-gray-500 hover:text-indigo-500 transition cursor-pointer">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    ></path>
                  </svg>
                  <input type="file" className="hidden" onChange={handleUploadImage} accept="image/*" />
                </label>
                <button className="p-2 text-gray-500 hover:text-indigo-500 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </button>
                <input
                  type="text"
                  placeholder="Nhập tin nhắn của bạn..."
                  className="flex-1 px-4 py-2 text-sm bg-transparent border-none focus:outline-none focus:ring-0"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button className="p-2 text-gray-500 hover:text-indigo-500 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    ></path>
                  </svg>
                </button>
                <button
                  className="ml-1 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  onClick={sendMessage}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
            <div className="text-center p-8 max-w-md">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Tin nhắn của bạn</h3>
              <p className="text-gray-500 mb-6">Chọn một liên hệ để bắt đầu trò chuyện</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};