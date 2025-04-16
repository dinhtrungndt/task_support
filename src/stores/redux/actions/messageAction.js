import { FETCH_MESSAGES_ERROR, FETCH_MESSAGES_SR } from "./types";
import messageService from "../../../services/messageService";

// Fetch messages between sender and receiver
export const fetchMessageSR = (idSender, idReceiver) => async (dispatch) => {
  try {
    const data = await messageService.fetchMessageSR(idSender, idReceiver);
    dispatch({
      type: FETCH_MESSAGES_SR,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_MESSAGES_ERROR,
      payload: error.message,
    });
  }
};