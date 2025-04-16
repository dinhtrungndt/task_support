import axiosClient from "../api/axiosClient";

const messageService = {
  // Fetch messages between sender and receiver
  async fetchMessageSR(idSender, idReceiver) {
    const response = await axiosClient.get(`message/get-message/list/${idSender}/${idReceiver}`);
    return response.data;
  },
};

export default messageService;