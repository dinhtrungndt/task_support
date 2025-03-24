import axiosClient from "../api/axiosClient.ts";

// register
export const register = async (form) => {
    const res = await axiosClient.post("/users/signup", form);
    return res;
};

// login
export const login = async ({ email, password }) => {
    try {
        const { data } = await axiosClient.post("/users/login", { email
        , password });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user._id));
        return data.user;
    } catch (error) {
        return null;
    }
    }

// get idUser
export const getIdUser = async (idUser) => {
    try {
        const { data } = await axiosClient.get(`/users/${idUser}`);
        return data;
    } catch (error) {
        return null;
    }
};
    