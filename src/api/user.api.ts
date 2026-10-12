import api from "@/lib/axios";

const userRoute = (route: string = "") => `/users${route}`;

interface LoginData {
    email: string,
    password: string
};

interface RegisterData extends LoginData {
    username: string
};

const register = async function ({ email, password, username }: RegisterData) {
    return api.put(
        userRoute("/register"),
        { email, password, username },
    );
};

const login = async function ({ email, password }: LoginData) {
    return api.put(
        userRoute("/login"),
        { email, password },
    );
};

const logout = async function () {
    return api.post(
        userRoute("/logout")
    );
};

const verify = async function () {
    return api.get(
        userRoute("/verify")
    );
};

const searchUsernames = async function (searchString: string) {
    return api.get(
        userRoute("/searchUsernames"),
        { params: { searchString } }
    );
};

const getOnlineStatus = async function (userId: string) {
    return api.get(
        userRoute(`/getOnlineStatus/${userId}`)
    );
};

export const UserRequest = {
    register, login, logout, verify, searchUsernames, getOnlineStatus
};