import {
  FETCH_TASKS,
  FETCH_TASKS_ERROR,
  ADD_TASK,
  UPDATE_TASK,
  DELETE_TASK,
  DELETE_TASKS,
} from "./types";
import axiosClient from "../../../api/axiosClient";

// Fetch all tasks
export const fetchTasks = () => async (dispatch) => {
  try {
    const response = await axiosClient.get("/tasks");

    dispatch({
      type: FETCH_TASKS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_TASKS_ERROR,
      payload: error.message,
    });
  }
};

// Add a new task with user ID directly passed from component
export const addTask = (taskData, userId) => async (dispatch) => {
  try {
    if (!userId) {
      throw new Error(
        "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại."
      );
    }

    // Prepare data for submission
    const taskToAdd = {
      connectionType: taskData.connectionType || "",
      installer: taskData.PInstaller || taskData.installer || "N/A",
      codeData: taskData.codeData || "N/A",
      typeData: taskData.typeData || "Data",
      installDate:
        taskData.AtSetting || taskData.installDate || new Date().toISOString(),
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

    // Sau khi thêm task, cần fetch chi tiết task đã được populate đầy đủ
    let createdTask = Array.isArray(response.data) ? response.data[0] : response.data;

    // Lấy chi tiết của task mới tạo để có thông tin đầy đủ
    if (createdTask._id) {
      const detailResponse = await axiosClient.get(`/tasks/${createdTask._id}`);
      createdTask = detailResponse.data;
    }

    dispatch({
      type: ADD_TASK,
      payload: createdTask,
    });

    return createdTask;
  } catch (error) {
    console.error("Add task error details:", error.response?.data || error);
    dispatch({
      type: FETCH_TASKS_ERROR,
      payload: error.message,
    });
    throw error;
  }
};

// Update an existing task
export const updateTask = (taskData) => async (dispatch) => {
  try {
    if (!taskData._id) {
      throw new Error("Task ID is required for update");
    }

    const taskToUpdate = {
      connectionType: taskData.connectionType || "",
      installer: taskData.PInstaller || taskData.installer || "N/A",
      codeData: taskData.codeData || "N/A",
      typeData: taskData.typeData || "Data",
      installDate:
        taskData.AtSetting || taskData.installDate || new Date().toISOString(),
      status: taskData.status || "Pending",
      notes: taskData.cancellationReason || taskData.notes || "",
      userAdd: taskData.userAdd,
    };

    const response = await axiosClient.put(
      `/tasks/${taskData._id}`,
      taskToUpdate
    );

    dispatch({
      type: UPDATE_TASK,
      payload: {
        ...response.data,
        _id: taskData._id,
      },
    });

    return {
      ...response.data,
      _id: taskData._id,
    };
  } catch (error) {
    dispatch({
      type: FETCH_TASKS_ERROR,
      payload: error.message,
    });
    throw error;
  }
};

// Delete a single task
export const deleteTask = (taskId) => async (dispatch) => {
  try {
    // Use the updated endpoint
    const response = await axiosClient.delete(`/tasks/${taskId}`);

    dispatch({
      type: DELETE_TASK,
      payload: taskId,
    });

    return response.data;
  } catch (error) {
    dispatch({
      type: FETCH_TASKS_ERROR,
      payload: error.message,
    });
    throw error;
  }
};

// Delete multiple tasks
export const deleteTasks = (taskIds) => async (dispatch) => {
  try {
    // Use the updated endpoint
    await axiosClient.delete("/tasks", { data: taskIds });

    dispatch({
      type: DELETE_TASKS,
      payload: taskIds,
    });
  } catch (error) {
    dispatch({
      type: FETCH_TASKS_ERROR,
      payload: error.message,
    });
    throw error;
  }
};

// Fetch tasks for a specific company
export const fetchTasksByCompany = (companyId) => async (dispatch) => {
  try {
    const response = await axiosClient.get(`/companies/${companyId}/tasks`);

    dispatch({
      type: FETCH_TASKS,
      payload: response.data,
    });

    return response.data;
  } catch (error) {
    dispatch({
      type: FETCH_TASKS_ERROR,
      payload: error.message,
    });
    throw error;
  }
};
