import axiosClient from "../api/axiosClient";

const taskService = {
  // Fetch all tasks
  async fetchTasks() {
    const response = await axiosClient.get("/tasks");
    return response.data;
  },

  // Fetch tasks by user ID
  async fetchTasksByUser(userId) {
    if (!userId) {
      throw new Error("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
    }
    const response = await axiosClient.get(`/tasks/user/${userId}`);
    return response.data;
  },

  // Add a new task
  async addTask(taskData, userId) {
    if (!userId) {
      throw new Error("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
    }

    const taskToAdd = {
      connectionType: taskData.connectionType || "",
      installer: taskData.PInstaller || taskData.installer || "N/A",
      codeData: taskData.codeData || "N/A",
      typeData: taskData.typeData || "Data",
      installDate: taskData.AtSetting || taskData.installDate || new Date().toISOString(),
      status: taskData.status || "Pending",
      notes: taskData.cancellationReason || taskData.notes || "",
      companyId: taskData.companyId || taskData.businessId,
      userAdd: userId,
    };

    let response;
    try {
      response = await axiosClient.post("/tasks", [taskToAdd]);
    } catch (error) {
      response = await axiosClient.post("/tasks/add", taskToAdd);
      if (!Array.isArray(response.data)) {
        response.data = [response.data];
      }
    }

    let createdTask = Array.isArray(response.data) ? response.data[0] : response.data;

    if (createdTask._id) {
      const detailResponse = await axiosClient.get(`/tasks/${createdTask._id}`);
      createdTask = detailResponse.data;
    }

    return createdTask;
  },

  // Update an existing task
  async updateTask(taskData) {
    if (!taskData._id) {
      throw new Error("Task ID is required for update");
    }

    const originalTask = await axiosClient.get(`/tasks/${taskData._id}`);

    const taskToUpdate = {
      connectionType: taskData.connectionType || originalTask.data.connectionType || "",
      installer: taskData.PInstaller || taskData.installer || originalTask.data.installer || "N/A",
      codeData: taskData.codeData || originalTask.data.codeData || "N/A",
      typeData: taskData.typeData || originalTask.data.typeData || "Data",
      installDate: taskData.AtSetting || taskData.installDate || originalTask.data.installDate || new Date().toISOString(),
      status: taskData.status || originalTask.data.status || "Pending",
      notes: taskData.cancellationReason || taskData.notes || originalTask.data.notes || "",
      userAdd: taskData.userAdd || originalTask.data.userAdd,
    };

    await axiosClient.put(`/tasks/${taskData._id}`, taskToUpdate);
    const updatedTaskResponse = await axiosClient.get(`/tasks/${taskData._id}`);
    return updatedTaskResponse.data;
  },

  // Delete a single task
  async deleteTask(taskId) {
    const response = await axiosClient.delete(`/tasks/${taskId}`);
    return response.data;
  },

  // Delete multiple tasks
  async deleteTasks(taskIds) {
    await axiosClient.delete("/tasks", { data: taskIds });
  },

  // Fetch tasks for a specific company
  async fetchTasksByCompany(companyId) {
    const response = await axiosClient.get(`/companies/${companyId}/tasks`);
    return response.data;
  },
};

export default taskService;