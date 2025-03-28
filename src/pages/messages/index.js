import React, { useState } from 'react';

export const MessagesPage = () => {
  const [message, setMessage] = useState('');
  
  const contacts = [
    { id: 1, name: "Mark Magnum", status: "Online", avatar: "https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=MM", time: "1m Ago", message: "Thank you very much. I'm glad...", read: true },
    { id: 2, name: "Mark Magn", time: "3m Ago", avatar: "https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=MM", message: "Hey, Surya let me tell you about...", read: true },
    { id: 3, name: "Emery Korgaard", time: "3m Ago", avatar: "https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=EK", message: "Thank's. You are very helpful...", read: false },
    { id: 4, name: "Zack Zak", time: "4m Ago", avatar: "https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=ZZ", message: "You Surya let me teach you about...", read: true },
    { id: 5, name: "Nadia Lauren", time: "5m Ago", avatar: "https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=NL", message: "Is there anything i can help? Just...", read: false },
    { id: 6, name: "Jason Statham", time: "6m Ago", avatar: "https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=JS", message: "You Surya let me share about...", read: true },
    { id: 7, name: "Angel Kimberly", time: "7m Ago", avatar: "https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=AK", message: "Okay, I know very well about it...", read: false },
    { id: 8, name: "Jason Momoa", time: "7m Ago", avatar: "https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=JM", message: "You Surya let me tell you about...", read: true },
  ];

  const messages = [
    { id: 1, sender: "Mark Magnum", time: "Today 11:52", message: "Mark Magnum, I have question about My Task", isSender: false },
    { id: 2, sender: "You", time: "Today 11:53", message: "Yes sure, Any problem with your assignment?", isSender: true },
    { id: 3, sender: "Mark Magnum", time: "Today 11:53", message: "How to make a responsive display from the dashboard?", isSender: false },
    { id: 4, sender: "Mark Magnum", time: "Today 11:52", message: "Is there a plugin to do this task?", isSender: false },
    { id: 5, sender: "You", time: "Today 11:53", message: "No plugins. You just have to make it smaller according to the size of the phone.", isSender: true },
    { id: 6, sender: "You", time: "Today 11:53", message: "Thank you very much. I'm glad you asked about the assignment", isSender: true },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar with Contacts List */}
      <div className="w-1/4 bg-white shadow-lg">
        {/* User Profile Header */}
        <div className="p-4 bg-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center text-xl font-bold">
                S
              </div>
              <div>
                <h2 className="font-semibold">Surya Chat</h2>
                <div className="flex items-center text-xs">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                  Active
                </div>
              </div>
            </div>
            <button className="text-white hover:text-indigo-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              className="w-full px-4 py-2 pl-10 text-sm bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="Search contacts..."
            />
            <svg
              className="absolute left-3 top-2.5 w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>

        {/* Contacts */}
        <div className="overflow-y-auto" style={{ height: "calc(100vh - 156px)" }}>
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`p-3 border-b border-gray-100 hover:bg-indigo-50 cursor-pointer transition duration-150 flex items-start ${
                contact.id === 1 ? "bg-indigo-50" : ""
              }`}
            >
              <div className="relative">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-12 h-12 rounded-full mr-3 border-2 border-indigo-100"
                />
                {contact.status === "Online" && (
                  <div className="absolute bottom-0 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {contact.name}
                  </h3>
                  <span className="text-xs text-gray-500">{contact.time}</span>
                </div>
                <p className={`text-xs ${!contact.read ? "font-medium text-gray-800" : "text-gray-500"} truncate mt-1`}>
                  {contact.message}
                </p>
              </div>
              {!contact.read && (
                <span className="ml-2 w-4 h-4 flex items-center justify-center bg-indigo-600 rounded-full text-xs text-white font-bold">1</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center">
            <div className="relative">
              <img
                src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=MM"
                alt="Mark Magnum"
                className="w-12 h-12 rounded-full mr-3 border-2 border-indigo-100"
              />
              <div className="absolute bottom-0 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">Mark Magnum</h3>
              <div className="flex items-center">
                <span className="text-xs text-gray-500">Last active: Just now</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </button>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
            </button>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex justify-center">
              <div className="bg-white text-xs text-gray-500 px-3 py-1 rounded-full shadow-sm">
                Today, {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </div>
            </div>
            
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isSender ? 'justify-end' : 'justify-start'}`}>
                {!msg.isSender && (
                  <img 
                    src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=MM" 
                    alt="Contact" 
                    className="w-8 h-8 rounded-full mr-2 self-end mb-1"
                  />
                )}
                <div 
                  className={`max-w-xs md:max-w-md lg:max-w-lg ${
                    msg.isSender 
                      ? 'bg-indigo-600 text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl' 
                      : 'bg-white text-gray-800 rounded-tl-xl rounded-tr-xl rounded-br-xl shadow-md'
                  } px-4 py-3 text-sm`}
                >
                  <p className={`leading-relaxed ${msg.isSender ? 'text-indigo-50' : 'text-gray-700'}`}>{msg.message}</p>
                  <div className={`text-xs mt-1 flex justify-end ${msg.isSender ? 'text-indigo-200' : 'text-gray-400'}`}>
                    {msg.time}
                    {msg.isSender && (
                      <svg className="w-4 h-4 ml-1 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </div>
                </div>
                {msg.isSender && (
                  <img 
                    src="https://ui-avatars.com/api/?background=4f46e5&color=ffffff&bold=true&name=SU" 
                    alt="You" 
                    className="w-8 h-8 rounded-full ml-2 self-end mb-1"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center max-w-4xl mx-auto bg-gray-100 rounded-xl shadow-sm p-1">
            <button className="p-2 ml-1 text-gray-500 hover:text-indigo-500 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
              </svg>
            </button>
            <button className="p-2 text-gray-500 hover:text-indigo-500 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </button>
            <input
              type="text"
              placeholder="Type your message here..."
              className="flex-1 px-4 py-2 text-sm bg-transparent border-none focus:outline-none focus:ring-0"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="p-2 text-gray-500 hover:text-indigo-500 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
              </svg>
            </button>
            <button className="ml-1 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};