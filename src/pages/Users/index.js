import React from 'react';

export const UserPages = () => {
  const teamMembers = [
    { id: 1, name: "Mark Magnum", role: "Project Manager", avatar: "https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=MM", status: "Online" },
    { id: 2, name: "Emily Korgaard", role: "UI/UX Designer", avatar: "https://ui-avatars.com/api/?background=fecaca&color=991b1b&bold=true&name=EK", status: "Away" },
    { id: 3, name: "Jason Statham", role: "Frontend Developer", avatar: "https://ui-avatars.com/api/?background=bfdbfe&color=1e40af&bold=true&name=JS", status: "Offline" },
    { id: 4, name: "Nadia Lauren", role: "Backend Developer", avatar: "https://ui-avatars.com/api/?background=d1fae5&color=065f46&bold=true&name=NL", status: "Online" },
    { id: 5, name: "Zack Zak", role: "QA Engineer", avatar: "https://ui-avatars.com/api/?background=fef3c7&color=92400e&bold=true&name=ZZ", status: "Online" },
    { id: 6, name: "Angel Kimberly", role: "Product Owner", avatar: "https://ui-avatars.com/api/?background=e0e7ff&color=3730a3&bold=true&name=AK", status: "Away" },
  ];

  const projects = [
    { id: 1, name: "Dashboard Redesign", progress: 75, members: 4 },
    { id: 2, name: "Mobile App Development", progress: 40, members: 5 },
    { id: 3, name: "API Integration", progress: 90, members: 3 },
    { id: 4, name: "User Testing", progress: 20, members: 2 },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Your Team</h1>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add New Member
            </button>
          </div>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start">
                    <div className="relative">
                      <img 
                        src={member.avatar} 
                        alt={member.name} 
                        className="w-16 h-16 rounded-full mr-4"
                      />
                      <div className={`absolute bottom-0 right-4 w-4 h-4 rounded-full border-2 border-white 
                        ${member.status === 'Online' ? 'bg-green-500' : 
                          member.status === 'Away' ? 'bg-yellow-500' : 'bg-gray-400'}`}>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                      <p className="text-sm text-gray-500">{member.role}</p>
                      <div className="flex mt-3">
                        <button className="text-blue-500 hover:text-blue-700 text-sm font-medium">Message</button>
                        <span className="mx-2 text-gray-300">|</span>
                        <button className="text-gray-500 hover:text-gray-700 text-sm font-medium">View Profile</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Active Projects */}
          <h2 className="text-xl font-bold text-gray-800 mb-4">Active Projects</h2>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Members</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{project.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">{project.progress}%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{project.members} members</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a href="#" className="text-blue-500 hover:text-blue-700 mr-3">View</a>
                      <a href="#" className="text-gray-500 hover:text-gray-700">Edit</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Team Activity Feed */}
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-5 space-y-5">
              <div className="flex">
                <div className="flex-shrink-0">
                  <img 
                    src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=MM" 
                    alt="Mark Magnum" 
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-900">Mark Magnum</span> completed the task 
                    <span className="font-medium text-gray-900"> "Create wireframes for mobile app"</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <img 
                    src="https://ui-avatars.com/api/?background=fecaca&color=991b1b&bold=true&name=EK" 
                    alt="Emily Korgaard" 
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-900">Emily Korgaard</span> commented on 
                    <span className="font-medium text-gray-900"> "Dashboard Redesign"</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <img 
                    src="https://ui-avatars.com/api/?background=d1fae5&color=065f46&bold=true&name=NL" 
                    alt="Nadia Lauren" 
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-900">Nadia Lauren</span> uploaded 
                    <span className="font-medium text-gray-900"> API documentation</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Yesterday at 1:34 PM</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <a href="#" className="text-sm font-medium text-blue-500 hover:text-blue-700">View all activity</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};