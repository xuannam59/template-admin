import axios from "axios";
import { Mutex } from "async-mutex";



const baseURL = import.meta.env.VITE_BACKEND_URL;
const instance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});


const NO_RETRY_HEADER = 'x-no-retry'
const mutex = new Mutex();

const handleRefreshToken = async (): Promise<string | null> => {
    return await mutex.runExclusive(async () => {
        const res = await instance.post('/auth/refresh-token');
        if (res && res.data) return res.data.access_token;
        else return null;
    })
}


// Add a request interceptor
instance.interceptors.request.use(function (config) {
    if (typeof window !== "undefined" && window && window.localStorage && window.localStorage.getItem('access_token')) {
        config.headers.Authorization = 'Bearer ' + window.localStorage.getItem('access_token');
    }
    if (!config.headers.Accept && config.headers["Content-Type"]) {
        config.headers.Accept = "application/json";
        config.headers["Content-Type"] = "application/json; charset=utf-8";
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response && response.data ? response.data : response;
}, async function (error) {
    if (
        error.config && error.response
        && +error.response.status === 401
        && error.config.url !== '/auth/login'
        && !error.config.headers[NO_RETRY_HEADER] // không có biến này ở header thì mới retry
    ) {
        const access_token = await handleRefreshToken();
        error.config.headers[NO_RETRY_HEADER] = 'true'; // retry chỉ được 1 lần
        if (access_token) {
            error.config.headers["Authorization"] = `Bearer ${access_token}`;
            localStorage.setItem("access_token", access_token);
            return instance.request(error.config);
        }
    }
    console.log(error.config.url, error.response)

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