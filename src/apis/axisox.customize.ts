import axios from "axios";
import handleAPI from "./handleAPI";


const baseURL = import.meta.env.VITE_BACKEND_URL;
const instance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

const handleRefreshToken = async (): Promise<any> => {
    const api = "/auth/refresh-token";
    const res = await instance.post(api);
    if (res && res.data) return res.data.access_token;
    else return null;
}
instance.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("access_token")}`;

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

const NO_RETRY_HEADER = 'x-no-retry'
// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response && response.data ? response.data : response;
}, async function (error) {
    if (
        error.config && error.response
        && +error.response.status === 401
        && !error.config.headers[NO_RETRY_HEADER] // không có biến này ở header thì mới retry
    ) {
        const access_token = await handleRefreshToken();
        if (access_token) {
            error.config.headers["Authorization"] = `Bearer ${access_token}`;
            error.config.headers[NO_RETRY_HEADER] = 'true'; // retry chỉ được 1 lần
            localStorage.setItem("access_token", access_token);
            return instance.request(error.config);
        }
    }

    if (
        error.config && error.response
        && +error.response.status === 400
        && error.config.url === "/auth/refresh-token"
    ) {
        window.location.href = "/auth/login"
    }
    return error?.response?.data ?? Promise.reject(error);
});

export default instance;