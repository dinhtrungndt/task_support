import { FETCH_MESSAGES_ERROR, FETCH_MESSAGES_SR } from "../actions/types";

const initialState = {
    messageses: [],
    loading: true,
    error: null,
};

const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_MESSAGES_SR:
            return {
                ...state,
                messages: action.payload,
                loading: false
            };

        case FETCH_MESSAGES_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false
            };

        default:
            return state;
    }
};

export default messageReducer;