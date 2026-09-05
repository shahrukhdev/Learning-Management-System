import api from "../api/api";

export const login = async (data: {
    email: string;
    password: string;
}) => {
    const response = await api.post("/auth/login", data);

    return response.data;
};

// export const logout = async () => {
//     const response = await api.post("/auth/logout");

//     return response.data;
// };

// export const forgotPassword = async (data: {
//     email: string;
// }) => {
//     const response = await api.post("/auth/forgot-password", data);

//     return response.data;
// };

// export const resetPassword = async (data: {
//     email: string;
//     token: string;
//     password: string;
//     password_confirmation: string;
// }) => {
//     const response = await api.post("/auth/reset-password", data);

//     return response.data;
// };