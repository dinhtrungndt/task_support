import axiosClient from "../../../api/axiosClient";
import { FETCH_MESSAGES_ERROR, FETCH_MESSAGES_SR } from "./types";


// Fetch all messages
export const fetchMessageSR = (idSender, idReceiver) => async (dispatch) => {
    try {
        const response = await axiosClient.get(
            `message/get-message/list/${idSender}/${idReceiver}`
        );

        // console.log("ID Sender:", idSender);
        // console.log("ID Receiver:", idReceiver);

        dispatch({
            type: FETCH_MESSAGES_SR,
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: FETCH_MESSAGES_ERROR,
            payload: error.message,
        });
    }
};
